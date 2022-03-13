class Streams {
  drag: string;

  dragover: string;

  streams: [string, boolean][];

  constructor() {
    this.drag = '';
    this.dragover = '';
    this.streams = JSON.parse(localStorage.getItem('streams')!) ?? [
      ['AnimeLab', false],
      ['Crunchyroll', false],
      ['Funimation', false],
      ['HiDive', false],
      ['Hulu', false],
      ['VRV', false],
      ['Wakanim', false],
      ['YouTube', false],
    ];
    this.renderItems();
  }

  renderItems() {
    const list = <HTMLElement>document.querySelector('.stream-box')!;
    list.innerText = '';
    for (const i in this.streams) {
      const div = document.createElement('div');
      div.draggable = true;
      div.className = 'stream-drag';
      div.ondrag = (e) => {
        this.drag = (<HTMLElement>e.target!).innerText;
      };
      div.ondragover = (e) => {
        e.preventDefault();
        this.dragover = (<HTMLElement>e.target!).innerText;
      };
      div.ondrop = () => {
        const index1: number = this.index(this.drag)!;
        const index2: number = this.index(this.dragover)!;
        this.streams.splice(index1, 1);
        this.streams.splice(index2, 0, [
          this.drag,
          (<HTMLInputElement>document.querySelector(`[name=${this.drag}]`)!)
            .checked,
        ]);
        this.renderItems();
      };
      div.id = `s${i}`;
      const input = document.createElement('input');
      input.type = 'checkbox';
      [input.name, input.checked] = this.streams[i];
      input.className = 'stream-input';
      input.onclick = (e) => {
        const ele = <HTMLInputElement>e.target!;
        this.streams[Number(ele.parentElement!.id.substring(1))][1] =
          ele.checked;
        localStorage.setItem('streams', JSON.stringify(this.streams));
      };
      const label = document.createElement('label');
      label.className = 'stream-label';
      label.setAttribute('for', this.streams[i][0]);
      label.innerHTML = input.name;
      div.append(input);
      div.append(label);
      list.append(div);
    }
    localStorage.setItem('streams', JSON.stringify(this.streams));
  }

  index(title: string) {
    return this.streams.findIndex(stream => title === stream[0])
  }
}
