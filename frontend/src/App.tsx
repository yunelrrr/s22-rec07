import { Component } from "react";
import "./App.css";

import Handlebars from "handlebars";

const html = `<div id="board">
                {{#each cells}}\
                  {{#if link}}\
                    <a href={{link}}><div class="cell {{clazz}}">{{text}}</div></a>\
                  {{else}}\
                    <div class="cell {{clazz}}">{{text}}</div>\
                  {{/if}}\
                {{/each}}\
              </div>\
              <div id="bottombar">\
                <a href="/newgame"><button>New Game</button></a>\
                <button>Undo</button>\
              </div>`;
const template = Handlebars.compile(html);
var oldHref = "http://localhost:3000";

interface Cell {
  text: String;
  clazz: String;
  link: String;
}

interface Cells {
  cells: Array<Cell>;
}

class App extends Component<{}, Cells> {
  constructor() {
    super({});
    this.state = {
      cells: [
        { text: "", clazz: "playable", link: "/play?x=0&y=0" },
        { text: "", clazz: "playable", link: "/play?x=1&y=0" },
        { text: "", clazz: "playable", link: "/play?x=2&y=0" },
        { text: "", clazz: "playable", link: "/play?x=0&y=1" },
        { text: "", clazz: "playable", link: "/play?x=1&y=1" },
        { text: "", clazz: "playable", link: "/play?x=2&y=1" },
        { text: "", clazz: "playable", link: "/play?x=0&y=2" },
        { text: "", clazz: "playable", link: "/play?x=1&y=2" },
        { text: "", clazz: "playable", link: "/play?x=2&y=2" },
      ],
    };
  }

  convertToCell(p: any): Array<Cell> {
    const newCells: Array<Cell> = [];
    for (var i = 0; i < p["cells"].length; i++) {
      var c: Cell = {
        text: p["cells"][i]["text"],
        clazz: p["cells"][i]["clazz"],
        link: p["cells"][i]["link"],
      };
      newCells.push(c);
    }

    return newCells;
  }

  async newGame() {
    const response = await fetch("newgame");
    const json = await response.json();

    const newCells: Array<Cell> = this.convertToCell(json);
    this.setState({ cells: newCells });
  }

  async play(url: String) {
    const href = "play?" + url.split("?")[1];
    const response = await fetch(href);
    const json = await response.json();

    const newCells: Array<Cell> = this.convertToCell(json);
    this.setState({ cells: newCells });
  }

  async move() {
    if (
      window.location.href === "http://localhost:3000/newgame" &&
      oldHref !== window.location.href
    ) {
      this.newGame();
      oldHref = window.location.href;
    } else if (
      window.location.href.split("?")[0] === "http://localhost:3000/play" &&
      oldHref !== window.location.href
    ) {
      this.play(window.location.href);
      oldHref = window.location.href;
    }
  }

  render() {
    this.move();
    return (
      <div className="App">
        <div
          dangerouslySetInnerHTML={{
            __html: template({ cells: this.state.cells }),
          }}
        />
      </div>
    );
  }
}

export default App;
