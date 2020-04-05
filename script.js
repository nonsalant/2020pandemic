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

function render_hero() {
  let url = "https://coronavirus-19-api.herokuapp.com/all/";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let recovered = Number(data.recovered.toFixed(0));
      let deaths = Number(data.deaths.toFixed(0));
      let cases = Number(data.cases.toFixed(0));

      let percentage = ((recovered + deaths) / cases).toFixed(2) * 100;
      let percentageEmpty = 100 - percentage;

      document.getElementById("hero").innerHTML = `
      <div class="percentage-bar" style="width:${percentage}%;">
        ${percentage}%
      </div>
      <small class="percentage-empty">
          ${percentageEmpty}% 🦠 ACTIVE CASES
      </small>

      <style>
      #virus:before {
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
      </style>
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

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let recovered = Number(data.recovered.toFixed(0));
      let deaths = Number(data.deaths.toFixed(0));
      let cases = Number(data.cases.toFixed(0));
      let cr = ((recovered + deaths) / cases).toFixed(2);
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
        <button class="close" onclick="remove_country(this)" style="display:none;">
          ❌
        </button>
        <button class="country-name has-tooltip-fade"
        data-tooltip="Cases per 1 million: ${data.casesPerOneMillion}
Deaths per 1 million: ${data.deathsPerOneMillion}
Tests per 1 million: ${data.testsPerOneMillion}

Cases today: ${data.todayCases}
Deaths today: ${data.todayDeaths}
"
        target="_blank">
          ${unescape(id)}:
        </button>&nbsp;
        (
        <b class="recovered" style="color:green">${recovered}</b>
        +
        <b class="deaths">${deaths}</b> )
        /
        <b class="cases" style="color:red">${cases}</b>
        =
        <b class="c-ratio ${color_change(cr)}">
          ${cr}
        </b>
        <span class="flag" style="width:1em; text-align:center;">
          ${flag_emoji(id)}
        </span>
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
  el.parentNode.remove();
  console.log(unescape(el.parentNode.id)+' removed.')

  let pandemicSavedCountries = localStorage.getItem('pandemicSavedCountries');
  let bbb = pandemicSavedCountries.split(',');
  let bb='';
  for (let i=0; i<bbb.length; i++) {
    if(bbb[i]==el.parentNode.id) {
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
