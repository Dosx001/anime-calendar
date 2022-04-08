window.onload = () => {
  fetch('../README.md')
    .then((resp) => resp.text())
    .then((txt) => {
      const content = document.getElementById('content')!;
      const aside = document.querySelector('aside')!;
      const lines = (<string>(<unknown>txt)).split('\n');
      let num = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '# Table of Contents') {
          i++;
          do {
            const a = document.createElement('a');
            [lines[i]] = lines[i].split(']');
            lines[i] = lines[i].substring(3, lines[i].length);
            if (lines[i].includes('[')) {
              lines[i] = lines[i].substring(2, lines[i].length);
              a.className = 'toc';
            }
            a.innerHTML = lines[i];
            a.href = `#${lines[i].split(' ').join('')}`;
            const div = document.createElement('div');
            div.append(a);
            aside.append(div);
            i++;
          } while (lines[i].includes('*'));
          num = i;
          break;
        }
      }
      for (let i = num; i < lines.length; i++) {
        let ele;
        switch (lines[i].substring(0, 1)) {
          case '!': {
            ele = document.createElement('img');
            let img = lines[i].split('(')[1];
            img = img.substring(0, img.length - 1);
            ele.src = img;
            break;
          }
          case '#':
            if (lines[i].substring(1, 2) === '#') {
              ele = document.createElement('h2');
              lines[i] = lines[i].substring(2, lines[i].length);
            } else {
              ele = document.createElement('h1');
              lines[i] = lines[i].substring(1, lines[i].length);
              ele.className = 'line';
            }
            ele.innerHTML = lines[i];
            ele.id = lines[i].split(' ').join('');
            break;
          case '*':
            ele = document.createElement('ul');
            do {
              const li = document.createElement('li');
              li.innerHTML = lines[i].substring(2, lines[i].length);
              ele.append(li);
              i++;
            } while (lines[i].substring(0, 1) === '*');
            break;
          case '|': {
            ele = document.createElement('table');
            let tr = document.createElement('tr');
            Object.keys(lines[i].split('|')).forEach((item) => {
              if (item) {
                const th = document.createElement('th');
                th.innerHTML = item;
                tr.append(th);
              }
            });
            ele.append(tr);
            i += 2;
            do {
              tr = document.createElement('tr');
              /* eslint no-loop-func: 0 */
              Object.keys(lines[i].split('|')).forEach((item) => {
                if (item) {
                  const td = document.createElement('td');
                  td.innerHTML = item;
                  tr.append(td);
                }
              });
              (<HTMLElement>tr.childNodes[0]).style.width = '20%';
              ele.append(tr);
              i++;
            } while (lines[i].substring(0, 1) === '|');
            break;
          }
          default:
            /* eslint no-continue: 0 */
            if (lines[i].length === 0) continue;
            ele = document.createElement('p');
            ele.innerHTML = lines[i];
            do {
              i++;
              ele.innerHTML += ` ${lines[i]}`;
            } while (lines[i].length !== 0);
        }
        content.append(ele);
      }
    });
};
