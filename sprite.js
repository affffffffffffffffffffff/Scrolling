/*DO NOT MODIFY THIS FILE*/
class Sprite {
  constructor(filename, s, x, y) {
    this.img = loadImage(filename);
    this.scale = s;
    this.center_x = x;
    this.center_y = y;
    this.change_x = 0; //don't change this
    this.change_y = 0; //don't change this
  }

  display() {
    let w = this.img.width * this.scale;
    let h = this.img.height * this.scale;

    image(this.img, this.center_x, this.center_y, w, h);
  }

  update() {
    this.center_x += this.change_x;
    this.center_y += this.change_y;
  }

  setLeft(left) {
    let w = this.img.width * this.scale;
    this.center_x = left + w / 2;
  }
  getLeft() {
    let w = this.img.width * this.scale;
    return this.center_x - w / 2;
  }
  setRight(right) {
    let w = this.img.width * this.scale;
    this.center_x = right - w / 2;
  }
  getRight() {
    let w = this.img.width * this.scale;
    return this.center_x + w / 2;
  }
  setTop(top) {
    let h = this.img.height * this.scale;
    this.center_y = top + h / 2;
  }
  getTop() {
    let h = this.img.height * this.scale;
    return this.center_y - h / 2;
  }
  setBottom(bottom) {
    let h = this.img.height * this.scale;
    this.center_y = bottom - h / 2;
  }
  getBottom() {
    let h = this.img.height * this.scale;
    return this.center_y + h / 2;
  }
}
