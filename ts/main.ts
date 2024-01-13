(<HTMLSelectElement>document.getElementById('info')).selectedIndex = Number(
  localStorage.getItem('info')!,
);
(<HTMLSelectElement>document.getElementById('format')).selectedIndex = Number(
  localStorage.getItem('format')!,
);
document.getElementById('list')!.innerHTML =
  localStorage.getItem('list') ?? 'Your List';

const CAL = new Calendar('24.0.8');
const SON = new Season();

window.onload = () => {
  CAL.init().then(() => {
    const obj = Object.keys({ ...CAL.store, ...CAL.past });
    new Search(
      obj.map((key) =>
        key in CAL.store
          ? [key, CAL.store[key].title]
          : [key, CAL.past[key].title],
      ),
    );
  });
  new Streams();
};

window.matchMedia('(min-width: 1200px)').onchange = () => {
  document.querySelectorAll<HTMLElement>('.date').forEach((ele) => {
    [ele.innerHTML, ele.title] = [ele.title, ele.innerHTML];
  });
};

function list() {
  const ele = document.getElementById('list')!;
  ele.innerHTML = ele.innerHTML === 'Full List' ? 'Your List' : 'Full List';
  localStorage.setItem('list', ele.innerHTML);
  if (document.getElementById('calendar')) {
    CAL.left.style.visibility === 'visible' ? CAL.init() : CAL.init(-7);
  } else {
    document.getElementById('season')!.remove();
    SON.init();
  }
}

document.onkeydown = (e) => {
  if (!((<HTMLElement>e.target!).id === 'search' || e.ctrlKey || e.altKey)) {
    switch (e.key) {
      case 'c':
        CAL.clear();
        break;
      case 'f':
        document.getElementById('format')!.focus();
        break;
      case 'i':
        document.getElementById('info')!.focus();
        break;
      case 'l':
        list();
        break;
      case 'm': {
        const cal = document.getElementById('calendar');
        cal ? cal.focus() : document.getElementById('season')!.focus();
        break;
      }
      case 'n':
        CAL.Right();
        break;
      case 'p':
        CAL.Left();
        break;
      case 's':
        document.getElementById('search')!.focus();
        e.preventDefault();
        break;
      case 'Escape':
      case 'Enter':
        (<HTMLElement>e.target!).blur();
        break;
      default:
    }
    if (document.getElementById('show')) {
      switch (e.key) {
        case 'a':
          CAL.setter();
          break;
        case 'n':
        case 'p':
          CAL.arrow();
          break;
        case 'r':
          CAL.Reset();
          break;
        case 'w': {
          const urls: { [key: string]: string } = {};
          document
            .querySelectorAll<HTMLAnchorElement>('.stream')
            .forEach((ele) => {
              urls[ele.innerText.substring(1)] = ele.href;
            });
          const streams: [string, boolean][] = JSON.parse(
            localStorage.getItem('streams')!,
          );
          const key = streams.find((stream) => stream[1] && stream[0] in urls);
          if (key) {
            window.open(urls[key[0]]);
            CAL.Stream();
          } else {
            const box = <HTMLElement>document.querySelector('.stream-box')!;
            box.style.backgroundColor = 'darkred';
            setTimeout(() => {
              box.style.backgroundColor = 'black';
            }, 50);
          }
          break;
        }
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          CAL.link(`${Number(e.key) - 1}`);
          break;
        default:
      }
      e.stopImmediatePropagation();
    }
  }
};
