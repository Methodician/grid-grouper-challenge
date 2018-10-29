import { Component } from '@angular/core';

@Component({
  selector: 'gg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // grid = [
  //   [1, 1, 0, 0],
  //   [0, 1, 0, 0],
  //   [0, 0, 1, 0],
  //   [1, 0, 1, 0]
  // ]

  grid = [
    [1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
  ]

  truthMap = {};
  groups = {};
  checkIterator = {};

  ngOnInit() {
    this.findTruthys();
    this.groupGrid();
  }

  toggleCell = (x, y) => {
    this.grid[x][y] = this.grid[x][y] === 0 ? 1 : 0;
    this.findTruthys();
    this.groupGrid();
  }

  findTruthys = () => {
    this.truthMap = {};
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        if (this.grid[x][y]) {
          const strCoord = `${x}-${y}`;
          const obj = this.truthMap[x] || {};
          obj[y] = strCoord;
          this.truthMap[x] = obj;
        }
      }
    }
  }

  groupGrid = () => {
    this.groups = {};
    this.checkIterator = {};
    for (let x in this.truthMap) {
      for (let y in this.truthMap[x]) {
        if (!this.hasGroup(this.truthMap[x][y])) {
          this.checkAround(+x, +y, this.truthMap[x][y])
        }
      }
    }
  }

  checkCurrentGroup(seedKey: string) {
    for (let key in this.checkIterator[seedKey]) {
      const current = this.checkIterator[seedKey][key];
      if (!current.checked) {
        this.checkAround(current.coords.x, current.coords.y, seedKey, key);
      }
    }
  }

  checkAround(x: number, y: number, seedKey: string, currentKey?: string) {
    const key = currentKey ? currentKey : seedKey;
    if (!this.groups[seedKey]) {
      this.groups[seedKey] = {};
      this.checkIterator[seedKey] = {};
    }
    this.groups[seedKey][key] = true;
    const coordsAround = [
      { x: x - 1, y: y - 1 },
      { x: x - 1, y: y },
      { x: x - 1, y: y + 1 },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 },
    ]
    for (let coords of coordsAround) {
      if (this.truthMap[coords.x]) {
        const thisKey = `${coords.x}-${coords.y}`;
        if (!!this.truthMap[coords.x][coords.y] && !(this.checkIterator[seedKey][thisKey] && this.checkIterator[seedKey][thisKey].checked)) {
          this.groups[seedKey][thisKey] = true;
          this.checkIterator[seedKey][thisKey] = { coords: coords, checked: false };
        }
      }
    }
    if (this.checkIterator[seedKey][key]) {
      this.checkIterator[seedKey][key].checked = true;
    }
    this.checkCurrentGroup(seedKey);
  }

  objectKeys(obj: Object) {
    return Object.keys(obj)
  }

  hasGroup(keyString: string) {
    let found = false;
    for (let key in this.groups) {
      if (!!this.groups[key][keyString]) {
        found = true;
      }
    }
    return found;
  }

}
