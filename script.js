render_stuff();
//let auto_refresh = setInterval(render_stuff, 3000);

function render_stuff() {
  render_hero();
  render_blocks();
}

function toggle_auto_refresh(checked) {
  if (checked) {
    auto_refresh = setInterval(render_stuff, 3000);
    document.querySelector('.legend').style.background='#ffff1122';
  } else {
    clearInterval(auto_refresh);
    document.querySelector('.legend').style.background='none';
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
      <style>
      #virus:before {
        /* Grab Google image graph (pie chart) */
        background: url("https://chart.googleapis.com/chart?cht=p&chd=t:${percentage},${percentageEmpty}&chs=200x200&chco=dddddd,ffff99") top center no-repeat;
        background-size: contain;
        opacity: .85;
        content: "";
        position: absolute;
        width: 1.5em;
        height: 1.5em;
        border-radius: 100%; border:0; padding:0;
        display: block;
      }
      </style>

      <div class="percentage-bar" style="width:${percentage}%;">

      <span>
        ${percentage}%
      </span>
   
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
  }
}

function render(id) {
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
        <button class="close" onclick="this.parentNode.remove()" style="display:none;">
          ❌
        </button>
        <a href="${url}" title="View raw data">
          ${unescape(id)}:
        </a>&nbsp;
        ( 
        <b style="color:green">${recovered}</b>
        +
        <b class="deaths">${deaths}</b> ) 
        /
        <b style="color:red">${cases}</b> 
        = 
        <b class="${color_change(cr)}">
          ${cr}
        </b>
        <span style="width:1em; text-align:center;">
          ${flag_emoji(id)}
        </span>
      `;
    });
}

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

function toggle_close_buttons(element) {
  let close_buttons = document.querySelectorAll('.close');
  
  if (typeof(close_buttons[0]) != 'undefined' && close_buttons != null) {
    if (close_buttons[0].style.display == 'none') {
      element.innerHTML = '&nbsp;&nbsp;&nbsp;Done deleting.&nbsp;&nbsp;&nbsp;';
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

// add_country('Diamond Princess');
function add_country(country) {
  document.querySelector('.country-stats').innerHTML += `
    <div id="${escape(country)}" class="block"></div>
  `;
  render(escape(country));
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

// //country_list();
// function country_list() {
//   let url = "https://coronavirus-19-api.herokuapp.com/countries/";
//   fetch(url)
//     .then((response) => {
//     return response.json();
//   })
//     .then((data) => {
//     let str = '';
//     for (let i=0; i<data.length; i++) {
//       str+=flag_emoji(escape(data[i].country))+' '+data[i].country+',';
//     }
//     console.log(str);
//     //"🇺🇸 USA,🇮🇹 Italy,🇪🇸 Spain,🇩🇪 Germany,🇫🇷 France,🇮🇷 Iran,🇬🇧 UK,🇨🇭 Switzerland,🇧🇪 Belgium,🇳🇱 Netherlands,🇹🇷 Turkey,🇰🇷 S. Korea,🇦🇹 Austria,🇨🇦 Canada,🇵🇹 Portugal,🇮🇱 Israel,🇧🇷 Brazil,🇳🇴 Norway,🇦🇺 Australia,🇸🇪 Sweden,🇨🇿 Czechia,🇮🇪 Ireland,🇲🇾 Malaysia,🇩🇰 Denmark,🇨🇱 Chile,🇵🇱 Poland,🇱🇺 Luxembourg,🇪🇨 Ecuador,🇷🇴 Romania,🇯🇵 Japan,🇷🇺 Russia,🇵🇰 Pakistan,🇵🇭 Philippines,🇹🇭 Thailand,🇸🇦 Saudi Arabia,🇮🇩 Indonesia,🇫🇮 Finland,🇿🇦 South Africa,🇮🇳 India,🇬🇷 Greece,🇮🇸 Iceland,🇲🇽 Mexico,🇵🇦 Panama,🇵🇪 Peru,🇩🇴 Dominican Republic,🇸🇬 Singapore,🇦🇷 Argentina,🇨🇴 Colombia,🇭🇷 Croatia,🇷🇸 Serbia,🇸🇮 Slovenia,🇪🇪 Estonia,🚢 Diamond Princess,🇶🇦 Qatar,🇪🇬 Egypt,🇭🇰 Hong Kong,🇮🇶 Iraq,🇦🇪 UAE,🇳🇿 New Zealand,🇩🇿 Algeria,🇲🇦 Morocco,🇧🇭 Bahrain,🇱🇹 Lithuania,🇦🇲 Armenia,🇺🇦 Ukraine,🇭🇺 Hungary,🇱🇧 Lebanon,🇱🇻 Latvia,🇧🇬 Bulgaria,🇧🇦 Bosnia and Herzegovina,🇸🇰 Slovakia,🇦🇩 Andorra,🇨🇷 Costa Rica,🇹🇳 Tunisia,🇺🇾 Uruguay,🇹🇼 Taiwan,🇰🇿 Kazakhstan,🇲🇩 Moldova,🇲🇰 North Macedonia,🇦🇿 Azerbaijan,🇯🇴 Jordan,🇰🇼 Kuwait,🇧🇫 Burkina Faso,🇸🇲 San Marino,🇨🇾 Cyprus,&nbsp;&nbsp;&nbsp;&thinsp; Réunion,🇦🇱 Albania,🇻🇳 Vietnam,🇴🇲 Oman,🇦🇫 Afghanistan,🇨🇺 Cuba,🇫🇴 Faeroe Islands,🇨🇮 Ivory Coast,🇸🇳 Senegal,🇲🇹 Malta,🇬🇭 Ghana,🇧🇾 Belarus,🇺🇿 Uzbekistan,&nbsp;&nbsp;&nbsp;&thinsp; Channel Islands,🇨🇲 Cameroon,🇭🇳 Honduras,🇻🇪 Venezuela,🇲🇺 Mauritius,🇧🇳 Brunei,🇱🇰 Sri Lanka,🇵🇸 Palestine,🇳🇬 Nigeria,🇰🇭 Cambodia,🇬🇵 Guadeloupe,🇬🇪 Georgia,🇧🇴 Bolivia,🇰🇬 Kyrgyzstan,🇲🇶 Martinique,🇲🇪 Montenegro,&nbsp;&nbsp;&nbsp;&thinsp; Trinidad and Tobago,🇾🇹 Mayotte,🇨🇩 DRC,🇷🇼 Rwanda,🇬🇮 Gibraltar,🇵🇾 Paraguay,🇱🇮 Liechtenstein,🇰🇪 Kenya,🇦🇼 Aruba,🇧🇩 Bangladesh,🇲🇨 Monaco,🇮🇲 Isle of Man,🇬🇫 French Guiana,🇲🇬 Madagascar,🇲🇴 Macao,🇬🇹 Guatemala,🇯🇲 Jamaica,🇵🇫 French Polynesia,🇿🇲 Zambia,🇧🇧 Barbados,🇺🇬 Uganda,🇹🇬 Togo,🇸🇻 El Salvador,🇲🇱 Mali,🇪🇹 Ethiopia,🇳🇪 Niger,🇧🇲 Bermuda,🇬🇳 Guinea,🇨🇬 Congo,🇹🇿 Tanzania,🇩🇯 Djibouti,🇲🇻 Maldives,🇲🇫 Saint Martin,🇭🇹 Haiti,🇳🇨 New Caledonia,🇧🇸 Bahamas,🇲🇲 Myanmar,🇰🇾 Cayman Islands,🇬🇶 Equatorial Guinea,🇪🇷 Eritrea,🇲🇳 Mongolia,&nbsp;&nbsp;&nbsp;&thinsp; Curaçao,🇩🇲 Dominica,🇳🇦 Namibia,🇬🇱 Greenland,🇸🇾 Syria,🇬🇩 Grenada,🇱🇨 Saint Lucia,🇸🇿 Eswatini,🇬🇾 Guyana,🇬🇼 Guinea-Bissau,🇱🇦 Laos,🇱🇾 Libya,🇲🇿 Mozambique,🇸🇨 Seychelles,🇸🇷 Suriname,🇦🇴 Angola,🇬🇦 Gabon,🇿🇼 Zimbabwe,🇦🇬 Antigua and Barbuda,🇰🇳 Saint Kitts and Nevis,🇸🇩 Sudan,🇨🇻 Cabo Verde,🇧🇯 Benin,🇻🇦 Vatican City,🇧🇱 St. Barth,🇸🇽 Sint Maarten,🇳🇵 Nepal,🇹🇩 Chad,🇫🇯 Fiji,🇲🇷 Mauritania,🇲🇸 Montserrat,🇹🇨 Turks and Caicos,🇬🇲 Gambia,🇳🇮 Nicaragua,🇧🇹 Bhutan,🇧🇿 Belize,🇧🇼 Botswana,🇨🇫 CAR,🇱🇷 Liberia,🇸🇴 Somalia,🚢 MS Zaandam,🇦🇮 Anguilla,🇻🇬 British Virgin Islands,🇵🇬 Papua New Guinea,🇻🇨 St. Vincent Grenadines,🇹🇱 Timor-Leste,🇨🇳 China,"
//   });
// }
