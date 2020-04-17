/* codepen.io/nonsalant/pen/jOPQRrE.js */

// Open external links in new tabs
let links = document.links;
for (let i = 0, linksLength = links.length; i < linksLength; i++) {
  if (links[i].hostname != window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noopener';
  } 
}

localStorageInit();

render_stuff();
//let auto_refresh = setInterval(render_stuff, 3000);


function render_stuff() {
  render_hero();
  render_blocks();

  
  fetch('//www.cloudflare.com/cdn-cgi/trace')
    .then((response) => {
      return response.text();
    })
    .then((data) => { 
      let value = data.split('\n')[8].split('loc=')[1];
      value = getCountryName(value);
      document.getElementById("hero-local").id= "hero-"+value;
      //console.log("hero-"+value);
      render_hero(("hero-"+value));
    });
} 

function toggle_auto_refresh(checked) {
  if (checked) {
    auto_refresh = setInterval(render_stuff, 3000);
    document.querySelectorAll('.legend')[0].style.backgroundColor='#F3F3B6';
    if (document.querySelector('#Global')) document.querySelector('#Global').style.backgroundColor="hsla(60, 60%, 85%, 0.53)";
  } else {
    clearInterval(auto_refresh);
    document.querySelectorAll('.legend')[0].style.backgroundColor='rgba(245, 245, 245, 1)';
    if (document.querySelector('#Global')) document.querySelector('#Global').style.backgroundColor="hsla(60, 0%, 95%, 0.53)";
  }
}

function render_hero(id="hero-global") {
  let url, country;
  
  if (id == "hero-global") {
    country = "Global";
    url = "https://coronavirus-19-api.herokuapp.com/all/";
    
  } else {
    if (id.startsWith("hero-")) {
      country=id.split("hero-")[1].replace(/ /g, "%20");
      url = "https://coronavirus-19-api.herokuapp.com/countries/" + country;
      //console.log(url)
    }
  }
  
  fetch(url).then((response)=>{return response.json();})
    .then((data) => {
      let recovered = Number(data.recovered.toFixed(0));
      let deaths = Number(data.deaths.toFixed(0));
      let cases = Number(data.cases.toFixed(0));

      let percentage = (((recovered + deaths) / cases) * 100).toFixed(0);
      let percentageEmpty = 100 - percentage;
    
      let cr_precise = ((recovered + deaths) / cases);
      let cr = cr_precise.toFixed(2); 
    
      let extra_css;
    
      if (country == "Global") {
        extra_css = `
        <style>
        .virus::before {
          /* Grab Google image graph (pie chart) */
          background: url("https://chart.googleapis.com/chart?cht=p&chd=t:${percentage},${percentageEmpty}&chs=200x200&chco=DCD3C0,ffefcc") center center no-repeat;
          background-size: contain;
          opacity: .90;
          content: "";
          position: absolute;
          width: 1.5em;
          height: 1.5em;
          border-radius: 100%; border:0; padding:0;
          display: block;
        }

        #hero-global-label::before {
          content: "🌎 ";
        }
        </style>
        `;
      } else {
        extra_css = `
        <style>
        #hero-local-label::before {
          content: "${flag_emoji(country)} ";
        }
        #hero-local-label::after {
          content: " in ${country}:";
        }
        <style>
        `
      }
      document.getElementsByTagName('body')[0].innerHTML+=extra_css;

      document.getElementById(id).innerHTML = `
      <div class="percentage-bar" style="width:${percentage}%;">
        <button class="no-button-styles"
        style="cursor: default !important;"
        data-tooltip="C. RATIO = ${cr_precise.toFixed(4)}"
        >
        ${percentage}%
        </button>
      </div>
      <small class="percentage-empty">
          ${percentageEmpty}% 🦠 ACTIVE CASES
      </small>
      `;
    });
  
}

function render_blocks() {
  let blocks = document.getElementsByClassName("block");
  for (let i = 0; i < blocks.length; i++) {
    render(blocks[i].id); 
    let blocks_array=[];
    blocks_array[i]=blocks[i].id;
    //console.log(blocks_array[i]);
  } 
  
}

function render(id) {
  
  if (!id) return;
  
  let url = ""; //let txt = '{"cases":422966,"deaths":18906,"recovered":109143}';
  if (id === "Global") {
    url = "https://coronavirus-19-api.herokuapp.com/all/";
  } else {
    url = "https://coronavirus-19-api.herokuapp.com/countries/" + id;
  }
  //console.log(url);
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let recovered, deaths, cases, cr_precise, percentage;
      if(data.recovered) recovered = Number(data.recovered.toFixed(0));
      else recovered = 0;
      if (data.deaths) deaths = Number(data.deaths.toFixed(0));
      else deaths = 0;
      if (data.cases) {
        cases = Number(data.cases.toFixed(0));
        cr_precise = ((recovered + deaths) / cases);
        percentage = (((recovered + deaths) / cases) * 100).toFixed(0);
      } else {
        cases = 0;
        cr_precise = 0;
        percentage = 0;
      }
      
      let cr = cr_precise.toFixed(2);
      
      let percentageEmpty = 100 - percentage;
    
      function color_change(cr) {
        let colorClass = "gray";
        if (Number(cr) < 0.1) {
          colorClass = "red";
        }
        if (Number(cr) > 0.3) {
          colorClass = "green";
        }
        return colorClass;
      }

      document.getElementById(id).innerHTML = `
      <div class="block-data">
          <button class="close" onclick="remove_country(this)" style="display:none;">
            ❌
          </button>
          <button class="country-name has-tooltip-right" 
          data-tooltip="Cases per 1 million: ${data.casesPerOneMillion} 
  Deaths per 1 million: ${data.deathsPerOneMillion}"
          >
            ${unescape(id)}:
          </button>&nbsp;
          ( 
          <button 
          data-tooltip="Tests per 1 million: ${data.testsPerOneMillion}"
         class="recovered has-tooltip-bottom" style="color:green">${recovered}</button>
          +
          <button 
          data-tooltip="Deaths today: ${data.todayDeaths}"
          class="deaths has-tooltip-bottom">${deaths}</button> ) 
          /
          <button 
          data-tooltip="Cases today: ${data.todayDeaths}"
          class="cases has-tooltip-bottom" style="color:red">${cases}</button> 
          = 
          <button 
          data-tooltip="${cr_precise.toFixed(3)} (${percentage}% )"
          class="c-ratio-wrapper has-tooltip-bottom">
            <b class="c-ratio ${color_change(cr)}">
              ${cr}
            </b>
          </button>
          <span class="flag" style="width:1em; text-align:center;">
            ${flag_emoji(id)}
          </span>
      </div> <!-- /.block-data -->
      `;
    })
    .then(() => {
      sortList();
    });
}

function sortList(sortBy=".cases", stopRefreshing = false) {
  let i, switching, b, shouldSwitch;
  switching = true;
  
  if(stopRefreshing) stop_auto_refresh();
  
  while (switching) {
    switching = false;
    b = document.querySelectorAll(".country-stats .block:not(#Global)");
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if ( b[i].querySelector(sortBy) && b[i+1].querySelector(sortBy) ) {
        if ( Number(b[i].querySelector(sortBy).innerHTML) < Number(b[i + 1].querySelector(sortBy).innerHTML) ) {
          //console.log(b[i].querySelector(sortBy).innerHTML);
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function stop_auto_refresh() {
  if(document.getElementById('autorefresh').checked) {
    document.getElementById('autorefresh').checked=false;
    toggle_auto_refresh(false);
  }
}


function toggle_close_buttons(element) {
  let close_buttons = document.querySelectorAll('.close');
  
  if (!close_buttons) return;
  
  if (typeof(close_buttons[0]) != 'undefined' && close_buttons != null) {
    if (close_buttons[0].style.display == 'none') {
      
      stop_auto_refresh();

      element.innerHTML = '&nbsp;&nbsp;&nbsp;Done deleting.&nbsp;&nbsp;';
      for (let i=0; i<close_buttons.length; i++) {
        close_buttons[i].style.display = 'block';
      }
    } else if (close_buttons[0].style.display == 'block') {
      element.innerHTML = 'Delete countries…';

      for (let i=0; i<close_buttons.length; i++) {
        close_buttons[i].style.display = 'none';
      } 
    }
  } else {
    element.innerHTML = 'Delete countries…';
    
  } 
  
}



document.querySelector('#country-list-choice').addEventListener('change', (event) => {
  let new_country = document.getElementById('country-list-choice').value;
  new_country = new_country.split(' ');
  new_country.shift();
  new_country = new_country.join(' '); 
  if (new_country && !document.getElementById(escape(new_country)) ) {
    console.log(new_country +" added.");
    add_country(new_country);
  } else if ( document.getElementById(escape(new_country)) ) {
    alert(new_country+' is already shown.')
  }
  document.getElementById('country-list-choice').value = '';
});




// localStorage

function localStorageInit() {
  let pandemicSavedCountries = localStorage.getItem('pandemicSavedCountries');
  if (!pandemicSavedCountries || pandemicSavedCountries === '{}') {
    let aaa = document.querySelectorAll('.country-stats .block');
    // let bb = aaa.map(x => x.id); 
    let aa = '';
    for (let i=0; i<aaa.length; i++) {
      aa += aaa[i].id;
      if (i<(aaa.length-1) && aaa[i].id && aaa[i].id!=='') {
          aa+=',';
      }
    }
    localStorage.setItem('pandemicSavedCountries', aa);
  } else {
    let bbb = pandemicSavedCountries.split(',');
    let bb='';
    for (let i=0; i<bbb.length; i++) {
      bb+=`
      <div id="${bbb[i]}" class="block"></div>
      `;
    }
    document.querySelector('.country-stats').innerHTML = bb;
  }
}

function remove_all_countries() {
  document.querySelector('.country-stats').innerHTML = '';
  localStorage.setItem('pandemicSavedCountries','');
}

function add_all_countries() {
  let countryOptions = document.querySelectorAll('#country-list option');
  remove_all_countries();
  for(let i=0; i<countryOptions.length; i++) {
    let new_country = countryOptions[i].value;
    new_country = new_country.split(' ');
    new_country.shift();
    new_country = new_country.join(' '); 
    if (new_country && !document.getElementById(escape(new_country)) ) {
      console.log(new_country +" added.");
      add_country(new_country, false);
    } else if ( document.getElementById(escape(new_country)) ) {
      alert(new_country+' is already shown.')
    }
  }
}

////sort_options();
// function sort_options() {
//   let i, switching, b, shouldSwitch;
//   switching = true;
//   while (switching) {
//     switching = false;
//     b = document.querySelectorAll("#country-list option");
//     for (i = 0; i < (b.length - 1); i++) {
//       shouldSwitch = false; 
//       if ( b[i].value && b[i+1].value ) {
//         let current = b[i].value.split(' ');
//         current.shift();
//         current = current.join(' ');
//         let next = b[i+1].value.split(' ');
//         next.shift();
//         next = next.join(' ');
//         if ( current > next ) {
//           shouldSwitch = true;
//           break;
//         }
//       }
//     }
//     if (shouldSwitch) {
//       b[i].parentNode.insertBefore(b[i + 1], b[i]);
//       switching = true;
//     }
//   }
// }

function remove_country(el) {
  el.parentNode.parentNode.remove(); 
  console.log(unescape(el.parentNode.parentNode.id)+' removed.')
  
  let pandemicSavedCountries = localStorage.getItem('pandemicSavedCountries');
  let bbb = pandemicSavedCountries.split(',');
  let bb='';
  for (let i=0; i<bbb.length; i++) {
    if(bbb[i]==el.parentNode.parentNode.id) {
        bbb.splice(i, 1);
       }
  }
  localStorage.setItem( 'pandemicSavedCountries', bbb.join() );
}

// add_country('Diamond Princess');
function add_country(country) { 
  document.querySelector('.country-stats').innerHTML += `
    <div id="${escape(country)}" class="block"></div>
  `;
  render(escape(country));
  //let pandemicSavedCountries = localStorage.getItem( 'pandemicSavedCountries');
  //if (pandemicSavedCountries && pandemicSavedCountries !== '{}') {
  let pandemicSavedCountries = localStorage.getItem('pandemicSavedCountries');
  let bbb=[];
  if (pandemicSavedCountries === null) {
    country=escape(country);
    bbb = [country];
  } else {
    let pandemicSavedCountries = localStorage.getItem('pandemicSavedCountries');
    bbb = pandemicSavedCountries.split(','); 
    bbb.push(escape(country));
  }
  localStorage.setItem( 'pandemicSavedCountries', bbb.join() );
}

// flag_emoji function by Stefan Matei
function flag_emoji(country) {
  switch (country) {
    case "Romania":
      return "🇷🇴";
    case "USA":
      return "🇺🇸";
    case "Global":
      return "🌎";
    case "China":
      return "🇨🇳";
    case "Italy":
      return "🇮🇹";
    case "Spain":
      return "🇪🇸";
    case "S.%20Korea":
      return "🇰🇷";
    case "Moldova":
      return "🇲🇩";
    case "Bulgaria":
      return "🇧🇬";
    case "Switzerland":
      return "🇨🇭";
    case "UK":
      return "🇬🇧";
    case "Iran":
      return "🇮🇷";
    case "France":
      return "🇫🇷";
    case "Germany":
      return "🇩🇪";
    case "Japan":
      return "🇯🇵";
    case "Belgium":
      return "🇧🇪";
    case "Netherlands":
      return "🇳🇱";
    case "Turkey":
      return "🇹🇷";
    case "Austria":
      return "🇦🇹";
    case "Canada":
      return "🇨🇦";
    case "Portugal":
      return "🇵🇹";
    case "Norway":
      return "🇳🇴";
    case "Brazil":
      return "🇧🇷";
    case "Israel":
      return "🇮🇱";
    case "Australia":
      return "🇦🇺";
    case "Sweden":
      return "🇸🇪";
    case "Czechia":
      return "🇨🇿";
    case "Malaysia":
      return "🇲🇾";
    case "Ireland":
      return "🇮🇪";
    case "Denmark":
      return "🇩🇰";
    case "Chile":
      return "🇨🇱";
    case "Luxembourg":
      return "🇱🇺";
    case "Poland":
      return "🇵🇱";
    case "Ecuador":
      return "🇪🇨";
    case "Russia":
      return "🇷🇺";
    case "Pakistan":
      return "🇵🇰";
    case "Philippines":
      return "🇵🇭";
    case "Thailand":
      return "🇹🇭";
    case "Saudi%20Arabia":
      return "🇸🇦";
    case "Indonesia":
      return "🇮🇩";
    case "Finland":
      return "🇫🇮";
    case "South%20Africa":
      return "🇿🇦";
    case "Greece":
      return "🇬🇷";
    case "Iceland":
      return "🇮🇸";
    case "India":
      return "🇮🇳";
    case "Mexico":
      return "🇲🇽";
    case "Panama":
      return "🇵🇦";
    case "Dominican%20Republic":
      return "🇩🇴";
    case "Singapore":
      return "🇸🇬";
    case "Peru":
      return "🇵🇪";
    case "Argentina":
      return "🇦🇷";
    case "Croatia":
      return "🇭🇷";
    case "Serbia":
      return "🇷🇸";
    case "Slovenia":
      return "🇸🇮";
    case "Estonia":
      return "🇪🇪";
    case "Diamond%20Princess":
      return "🚢";
    case "Colombia":
      return "🇨🇴";
    case "Qatar":
      return "🇶🇦";
    case "Hong%20Kong":
      return "🇭🇰";
    case "UAE":
      return "🇦🇪";
    case "Egypt":
      return "🇪🇬";
    case "New%20Zealand":
      return "🇳🇿";
    case "Algeria":
      return "🇩🇿";
    case "Iraq":
      return "🇮🇶";
    case "Morocco":
      return "🇲🇦";
    case "Bahrain":
      return "🇧🇭";
    case "Lithuania":
      return "🇱🇹";
    case "Armenia":
      return "🇦🇲";
    case "Ukraine":
      return "🇺🇦";
    case "Hungary":
      return "🇭🇺";
    case "Lebanon":
      return "🇱🇧";
    case "Latvia":
      return "🇱🇻";
    case "Bosnia%20and%20Herzegovina":
      return "🇧🇦";
    case "Slovakia":
      return "🇸🇰";
    case "Andorra":
      return "🇦🇩";
    case "Costa%20Rica":
      return "🇨🇷";
    case "Tunisia":
      return "🇹🇳";
    case "Uruguay":
      return "🇺🇾";
    case "Taiwan":
      return "🇹🇼";
    case "Kazakhstan":
      return "🇰🇿";
    case "North%20Macedonia":
      return "🇲🇰";
    case "Azerbaijan":
      return "🇦🇿";
    case "Kuwait":
      return "🇰🇼";
    case "Jordan":
      return "🇯🇴";
    case "San%20Marino":
      return "🇸🇲";
    case "Cyprus":
      return "🇨🇾";
    case "Réunion":
      return "🇷🇪";
    case "Albania":
      return "🇦🇱";
    case "Burkina%20Faso":
      return "🇧🇫";
    case "Vietnam":
      return "🇻🇳";
    case "Oman":
      return "🇴🇲";
    case "Afghanistan":
      return "🇦🇫";
    case "Cuba":
      return "🇨🇺";
    case "Faeroe%20Islands":
      return "🇫🇴";
    case "Faroe%20Islands":
      return "🇫🇴";
    case "Ivory%20Coast":
      return "🇨🇮";
    case "Senegal":
      return "🇸🇳";
    case "Malta":
      return "🇲🇹";
    case "Ghana":
      return "🇬🇭";
    case "Belarus":
      return "🇧🇾";
    case "Uzbekistan":
      return "🇺🇿";
    case "Channel%20Islands":
      return "&nbsp;&nbsp;&nbsp;&thinsp;";
    case "Cameroon":
      return "🇨🇲";
    case "Honduras":
      return "🇭🇳";
    case "Venezuela":
      return "🇻🇪";
    case "Mauritius":
      return "🇲🇺";
    case "Brunei":
      return "🇧🇳";
    case "Sri%20Lanka":
      return "🇱🇰";
    case "Palestine":
      return "🇵🇸";
    case "Nigeria":
      return "🇳🇬";
    case "Cambodia":
      return "🇰🇭";
    case "Guadeloupe":
      return "🇬🇵";
    case "Georgia":
      return "🇬🇪";
    case "Bolivia":
      return "🇧🇴";
    case "Kyrgyzstan":
      return "🇰🇬";
    case "Martinique":
      return "🇲🇶";
    case "Montenegro":
      return "🇲🇪";
    case "Trinidad%and%Tobago":
      return "🇹🇹";
    case "Mayotte":
      return "🇾🇹";
    case "DRC":
      return "🇨🇩";
    case "Rwanda":
      return "🇷🇼";
    case "Gibraltar":
      return "🇬🇮";
    case "Paraguay":
      return "🇵🇾";
    case "Liechtenstein":
      return "🇱🇮";
    case "Kenya":
      return "🇰🇪";
    case "Aruba":
      return "🇦🇼";
    case "Bangladesh":
      return "🇧🇩";
    case "Isle%20of%20Man":
      return "🇮🇲";
    case "Monaco":
      return "🇲🇨";
    case "French%20Guiana":
      return "🇬🇫";
    case "Madagascar":
      return "🇲🇬";
    case "Macao":
      return "🇲🇴";
    case "Guatemala":
      return "🇬🇹";
    case "Jamaica":
      return "🇯🇲";
    case "French%20Polynesia":
      return "🇵🇫";
    case "Zambia":
      return "🇿🇲";
    case "Barbados":
      return "🇧🇧";
    case "Uganda":
      return "🇺🇬";
    case "Togo":
      return "🇹🇬";
    case "El%20Salvador":
      return "🇸🇻";
    case "Mali":
      return "🇲🇱";
    case "Ethiopia":
      return "🇪🇹";
    case "Niger":
      return "🇳🇪";
    case "Bermuda":
      return "🇧🇲";
    case "Guinea":
      return "🇬🇳";
    case "Congo":
      return "🇨🇬";
    case "Tanzania":
      return "🇹🇿";
    case "Djibouti":
      return "🇩🇯";
    case "Maldives":
      return "🇲🇻";
    case "Saint%20Martin":
      return "🇲🇫";
    case "Haiti":
      return "🇭🇹";
    case "New%20Caledonia":
      return "🇳🇨";
    case "Bahamas":
      return "🇧🇸";
    case "Myanmar":
      return "🇲🇲";
    case "Cayman%20Islands":
      return "🇰🇾";
    case "Equatorial%20Guinea":
      return "🇬🇶";
    case "Eritrea":
      return "🇪🇷";
    case "Mongolia":
      return "🇲🇳";
    case "Curaçao":
      return "🇨🇼";
    case "Dominica":
      return "🇩🇲";
    case "Namibia":
      return "🇳🇦";
    case "Greenland":
      return "🇬🇱";
    case "Syria":
      return "🇸🇾";
    case "Grenada":
      return "🇬🇩";
    case "Saint%20Lucia":
      return "🇱🇨";
    case "Eswatini":
      return "🇸🇿";
    case "Guyana":
      return "🇬🇾";
    case "Guinea-Bissau":
      return "🇬🇼";
    case "Laos":
      return "🇱🇦";
    case "Libya":
      return "🇱🇾";
    case "Mozambique":
      return "🇲🇿";
    case "Seychelles":
      return "🇸🇨";
    case "Suriname":
      return "🇸🇷";
    case "Angola":
      return "🇦🇴";
    case "Gabon":
      return "🇬🇦";
    case "Zimbabwe":
      return "🇿🇼";
    case "Antigua%20and%20Barbuda":
      return "🇦🇬";
    case "Saint%20Kitts%20and%20Nevis":
      return "🇰🇳";
    case "Sudan":
      return "🇸🇩";
    case "Cabo%20Verde":
      return "🇨🇻";
    case "Cape%20Verde":
      return "🇨🇻";
    case "Benin":
      return "🇧🇯";
    case "Vatican%20City":
      return "🇻🇦";
    case "St.%20Barth":
      return "🇧🇱";
    case "Sint%20Maarten":
      return "🇸🇽";
    case "Nepal":
      return "🇳🇵";
    case "Chad":
      return "🇹🇩";
    case "Fiji":
      return "🇫🇯";
    case "Mauritania":
      return "🇲🇷";
    case "Montserrat":
      return "🇲🇸";
    case "Turks%20and%20Caicos":
      return "🇹🇨";
    case "Gambia":
      return "🇬🇲";
    case "Nicaragua":
      return "🇳🇮";
    case "Bhutan":
      return "🇧🇹";
    case "Belize":
      return "🇧🇿";
    case "CAR":
      return "🇨🇫";
    case "Liberia":
      return "🇱🇷";
    case "Somalia":
      return "🇸🇴";
    case "MS%20Zaandam":
      return "🚢";
    case "Anguilla":
      return "🇦🇮";
    case "British%20Virgin%20Islands":
      return "🇻🇬";
    case "Papua%20New%20Guinea":
      return "🇵🇬";
    case "St.%20Vincent%20Grenadines":
      return "🇻🇨";
    case "Timor-Leste":
      return "🇹🇱";
    case "Botswana":
      return "🇧🇼";
  }
  return "&nbsp;&nbsp;&nbsp;&thinsp;";
}


var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Réunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};

function getCountryName(countryCode) {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } else {
        return countryCode;
    }
}