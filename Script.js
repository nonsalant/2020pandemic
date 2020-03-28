render_stuff();
let auto_refresh = setInterval(render_stuff, 3000);

function render_stuff() {
  render_hero();

  let blocks = document.getElementsByClassName("block");
  for (let i = 0; i < blocks.length; i++) {
    render(blocks[i].id);
  }
}

function toggle_auto_refresh(checked) {
  //clearInterval(auto_refresh);
  if (checked) {
    auto_refresh = setInterval(render_stuff, 3000);
  } else {
    clearInterval(auto_refresh);
  }
}

//render_hero();

function render_hero() {
  let url = "https://coronavirus-19-api.herokuapp.com/all/";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      percentage = (
        ((data.recovered + data.deaths) / data.cases).toFixed(2) * 100
      ).toFixed(0);
      document.getElementById("hero").innerHTML = `
<style>
#virus:before {
  background: url("https://chart.googleapis.com/chart?cht=p&chd=t:${percentage},${
        100 - percentage
      }&chs=200x200&chco=dddddd,ffff99")
    top center no-repeat;
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
      <div class="percentage-bar" style="width:${percentage}%; 
          min-width: 1.5em;
          float:left; text-align:center;
          background-color:#ddd; color: #222; border-radius:.1em; font-weight:normal; 
          padding:0 .2em; margin:0; margin-right:.2em;
          display:flex; justify-content:center; align-items:center;
          flex-direction:column; line-height:.75em; padding-top:.25em;
          height:2em;

          ">

      <span>
        ${(
          ((data.recovered + data.deaths) / data.cases).toFixed(2) * 100
        ).toFixed(0)}%
      </span>

      <small class="red" style="display:none; font-size:.5em">
        (down 3%)
      </small>
   
    </div>

    <small style="font-size:.75em; line-height:1em; 
      float:left; display:block;
      margin:.3em 0 .3em .3em;
      opacity:.75;">
        ${(
          100 -
          ((data.recovered + data.deaths) / data.cases).toFixed(2) * 100
        ).toFixed(0)}%
        🦠 ACTIVE CASES
        <span style="display:none; margin-left:-.25em">
        &lsaquo;</span>
    </small>
    `;
    });
}

function render(id) {
  let url = "";
  //let idForLink = id;
  //let txt = '{"cases":422966,"deaths":18906,"recovered":109143}';
  if (id === "Global") {
    //idForLink = "All";
    url = "https://coronavirus-19-api.herokuapp.com/all/";
  } else {
    url = "https://coronavirus-19-api.herokuapp.com/countries/" + id;
  }

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let cr = ((data.recovered + data.deaths) / data.cases).toFixed(2);

      function color_change(cr) {
        //let cr = ((data.recovered + data.deaths) / data.cases).toFixed(2);
        let colorClass = "gray";
        if (Number(cr) < 0.1) {
          colorClass = "red";
          //alert(parseInt(cr, 10))
        }
        if (Number(cr) > 0.3) {
          colorClass = "green";
        }
        return colorClass;
      }

      document.getElementById(id).innerHTML = `
        <a href="${url}">
          ${unescape(id)}:
        </a>&nbsp;
        ( 
        <b style="color:green">${data.recovered.toFixed(0)}</b>
        +
        <b style="
        background-color:#111; color: #eee; border-radius:.1em; padding:0 .2em;
        ">${data.deaths.toFixed(0)}</b> ) /
        <b style="color:red">${data.cases.toFixed(0)}</b> 
        = 
        <b style-inline="" class="${color_change(cr)}">
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
