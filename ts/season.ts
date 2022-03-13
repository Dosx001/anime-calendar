interface HTMLImageElement {
  loading: string;
}

interface ChildNode {
  innerText: string;
}

class Season {
  list: { [key: string]: null };

  constructor() {
    this.list = JSON.parse(localStorage.getItem('season')!) ?? {};
    this.set().then((keys) => {
      for (const title in this.list) {
        const show = keys[title];
        if (show) {
          CAL.shows[show] = [false, false];
          delete this.list[title];
          localStorage.setItem('season', JSON.stringify(this.list));
        }
      }
      localStorage.setItem('shows', JSON.stringify(CAL.shows));
    });
  }

  async set() {
    return await (await fetch('shows/keys.json')).json();
  }

  async init() {
    const div = document.createElement('div');
    div.id = 'season';
    div.tabIndex = 1;
    document.body.append(div);
    const data = await (await fetch('season/shows.json')).json();
    let count = 0;
    for (const show in document.getElementById('list')!.innerHTML === 'Your List'
      ? data
      : this.list) {
      const content = document.createElement('div');
      content.className = 'show-season';
      const table = document.createElement('table');
      table.className = 'info';
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.innerHTML = show;
      tr.append(th);
      table.append(tr);
      for (const item in data[show]) {
        switch (item) {
          case 'cover':
            const cover = document.createElement('div');
            cover.className = 'cover-season';
            cover.align = 'right';
            const img = document.createElement('img');
            img.src = data[show][item];
            img.width = 340;
            img.height = 440;
            if (count > 2) {
              img.src += '?w=5&h=5';
              const observer = new IntersectionObserver(
                (entries, observer) => {
                  entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const img = <HTMLImageElement>entry.target;
                    img.src = img.src.substring(0, img.src.length - 8);
                    observer.unobserve(img);
                  });
                },
                { root: div, rootMargin: '500px 0px' },
              );
              observer.observe(img);
              img.loading = 'lazy';
            } else count++;
            cover.append(img);
            content.append(cover);
            break;
          case 'Genres':
            table.append(this.row(item, data[show][item].join(', ')));
            break;
          default:
            table.append(this.row(item, data[show][item]));
        }
      }
      const btn = document.createElement('button');
      btn.innerHTML = show in this.list ? 'Remove' : 'Add';
      btn.onclick = (e) => {
        const title = (<HTMLElement>e.srcElement!).previousElementSibling!
          .childNodes[0].innerText;
        if (title in this.list) {
          delete this.list[title];
          (<HTMLElement>e.srcElement!).innerHTML = 'Add';
        } else {
          this.list[title] = null;
          (<HTMLElement>e.srcElement!).innerHTML = 'Remove';
          const temp: { [key: string]: null } = {};
          for (const show of Object.keys(this.list).sort()) {
            temp[show] = null;
          }
          this.list = temp;
        }
        localStorage.setItem('season', JSON.stringify(this.list));
      };
      content.append(table);
      content.append(btn);
      div.append(content);
    }
  }

  row(item: string, content: string) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.innerHTML = `${item}: ${content}`;
    tr.append(td);
    return tr;
  }
}
