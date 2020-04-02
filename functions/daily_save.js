//import fetch from "node-fetch"

// https://kentcdodds.com/blog/super-simple-start-to-serverless

exports.handler = async event => {
  const prefix = event.queryStringParameters.prefix || 'randid'
  const rando = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3)
                +'-'+Math.floor(Math.random() * 999);
  const blocks = ["Global","USA","Italy","China","Spain","Germany","Iran","France","UK","Switzerland","S.%20Korea","Japan","Romania","Bulgaria","Moldova"];
  return {
    statusCode: 200,
    body: `
    ${prefix}-${rando}
    ${render_blocks(blocks)}
    `,
  }
}

// from script.js

function render_blocks(blocks) {
  //let blocks = document.getElementsByClassName("block");
  //let blocks = ["Global","USA","Italy","China","Spain","Germany","Iran","France","UK","Switzerland","S.%20Korea","Japan","Romania","Bulgaria","Moldova"];
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

      return  `${recovered},${deaths},${cases},${cr}`
    }
}
