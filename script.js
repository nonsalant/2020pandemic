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
  }
  return "&nbsp;&nbsp;&nbsp;&thinsp;";
}
