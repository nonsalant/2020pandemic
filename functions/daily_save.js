// https://kentcdodds.com/blog/super-simple-start-to-serverless
// runs @ https://stefanmatei.com/.netlify/functions/randid (125K free req/month)
global.fetch = require("node-fetch");

exports.handler = async event => {
  const prefix = event.queryStringParameters.prefix || 'randid'
  const rando = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3)
                +'-'+Math.floor(Math.random() * 999);
  return {
    statusCode: 200,
    body: `
    ${prefix}-${rando}
    ${render_blocks()}
    `,
  }
}

// from script.js

function render_blocks() {
  //let blocks = document.getElementsByClassName("block");
  let blocks = ["Global","USA","Italy","China","Spain","Germany","Iran","France","UK","Switzerland","S.%20Korea","Japan","Romania","Bulgaria","Moldova"];
  for (let i = 0; i < blocks.length; i++) {
    //    render(blocks[i].id);
    render(blocks[i]);
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
        <button class="close" onclick="remove_country(this)" style="display:none;">
          ❌
        </button>
        <!--<a href="${url}" title="View raw data">-->
          ${unescape(id)}:
        <!--</a>-->&nbsp;
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
