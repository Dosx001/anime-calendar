"use strict";
Date.prototype.getWeek = function fn() {
    const date = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    date.setDate(date.getDate() - date.getDay());
    return Math.ceil((date.valueOf() - new Date(date.getFullYear(), 0, 1).valueOf()) /
        86400000 /
        7);
};
class Calendar {
    constructor(ver) {
        this.getDates = (offset = 0) => {
            const dates = [];
            const date = new Date();
            let day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            switch (date.getDay()) {
                case 0:
                    day += offset - 6;
                    break;
                case 1:
                    day += offset;
                    break;
                case 2:
                    day += offset - 1;
                    break;
                case 3:
                    day += offset - 2;
                    break;
                case 4:
                    day += offset - 3;
                    break;
                case 5:
                    day += offset - 4;
                    break;
                default:
                    day += offset - 5;
            }
            for (let i = 0; i < 7; i++)
                dates.push(new Date(year, month, day + i));
            return dates;
        };
        this.ider_slot = (day, time) => time.substring(1, 2) === ':'
            ? day * 10000 +
                Number(time.substring(0, 1)) * 100 +
                Number(time.substring(2, 4)) +
                time.substring(5, 6)
            : day * 10000 +
                Number(time.substring(0, 2)) * 100 +
                Number(time.substring(3, 5)) +
                time.substring(6, 7);
        this.ider_show = (title) => {
            const words = title.split(' ');
            return (title.length +
                words.length.toString() +
                words[words.length - 1].replace(/\W/g, ''));
        };
        this.minMax = (t1, t2) => new Date(`2000/1/1 ${t1}`) < new Date(`2000/1/1 ${t2}`)
            ? [t1, t2]
            : [t2, t1];
        this.resizeCalendar = () => {
            const cal = document.getElementById('calendar');
            if (cal) {
                cal.style.height =
                    document.getElementById('info').value === '0' &&
                        document.getElementById('show')
                        ? '38vh'
                        : '85vh';
            }
        };
        this.shows = JSON.parse(localStorage.getItem('shows')) ?? {};
        this.left = document.getElementById('left');
        this.right = document.getElementById('right');
        this.left.style.visibility = 'visible';
        this.right.style.visibility = 'visible';
        this.past = JSON.parse(localStorage.getItem('past'));
        this.store = JSON.parse(localStorage.getItem('store'));
        if (localStorage.getItem('ver') !== ver) {
            localStorage.setItem('ver', ver);
            this.set('./shows/shows.json', 'store');
            this.set('./shows/past_shows.json', 'past').then(() => {
                Object.keys(this.shows).forEach((show) => {
                    if (!(show in this.store || show in this.past)) {
                        delete this.shows[show];
                    }
                });
                localStorage.setItem('shows', JSON.stringify(this.shows));
            });
        }
    }
    async set(file, key) {
        const data = await (await fetch(file)).json();
        key === 'store' ? (this.store = data) : (this.past = data);
        localStorage.setItem(key, JSON.stringify(data));
    }
    async init(offset = 0) {
        const CAL = document.getElementById('calendar');
        CAL ? CAL.remove() : document.getElementById('season').remove();
        this.updateTime();
        const format = localStorage.getItem('format');
        let data = await (await fetch(offset === 0 ? './shows/time.json' : './shows/past_time.json')).json();
        switch (format) {
            case '1':
                data = data.cutoff;
                break;
            case '2':
                data = data.compact;
                break;
            default:
                data = data.full;
        }
        let times;
        if (localStorage.getItem('list') === 'Your List' ||
            Object.keys(this.shows).length === 0) {
            times = data;
        }
        else {
            switch (format) {
                case '1':
                    times = this.cutoff(data, offset);
                    break;
                case '2':
                    times = this.compact(data, offset);
                    break;
                default:
                    times = this.full(data, offset);
            }
        }
        this.calendar(this.getDates(offset), times);
        this.resizeCalendar();
        this.createShows(offset);
    }
    calendar(dates, times) {
        document.getElementById('month').innerHTML =
            dates[0].getMonth() === dates[6].getMonth()
                ? dates[0].toLocaleDateString('en-US', { month: 'long' })
                : `${dates[0].toLocaleDateString('en-US', {
                    month: 'long',
                })} to ${dates[6].toLocaleDateString('en-US', { month: 'long' })}`;
        let td = document.createElement('td');
        td.className = 'date corner';
        let tr = document.createElement('tr');
        tr.append(td);
        dates.forEach(async (date) => {
            td = document.createElement('td');
            td.className = 'date';
            td.innerHTML = `${date.getDate()} ${date.toLocaleDateString('en-US', {
                weekday: 'long',
            })}`;
            td.title = `${date.getDate()} ${date.toLocaleDateString('en-US', {
                weekday: 'short',
            })}`;
            tr.append(td);
        });
        const thead = document.createElement('thead');
        thead.append(tr);
        const tbody = document.createElement('tbody');
        times.forEach(async (time) => {
            td = document.createElement('td');
            td.className = 'time';
            td.innerHTML = time;
            tr = document.createElement('tr');
            tr.append(td);
            for (let day = 1; day < 8; day++) {
                td = document.createElement('td');
                td.id = this.ider_slot(day, time);
                td.className = 'slot';
                tr.append(td);
            }
            tbody.append(tr);
        });
        const table = document.createElement('table');
        table.append(thead);
        table.append(tbody);
        const calendar = document.createElement('div');
        calendar.id = 'calendar';
        calendar.tabIndex = 1;
        calendar.append(table);
        document.body.append(calendar);
    }
    createShows(offset) {
        const data = offset === 0 ? this.store : this.past;
        Object.keys(document.getElementById('list').innerHTML === 'Your List'
            ? data
            : this.shows).forEach((show) => {
            if (show in data) {
                const button = document.createElement('button');
                button.id = this.ider_show(show);
                button.className = 'show';
                button.innerHTML = show;
                if (show in this.shows) {
                    button.style.borderColor = '#4f004f';
                    button.style.color = (this.left.style.visibility === 'visible'
                        ? this.shows[show][0]
                        : this.shows[show][1])
                        ? '#4f4f4f'
                        : 'purple';
                }
                button.onclick = (e) => {
                    if (localStorage.getItem('info') === '0') {
                        if (document.getElementById('title'))
                            e.preventDefault();
                    }
                    else
                        e.preventDefault();
                    this.streamInfo(e.target.innerText);
                };
                const a = document.createElement('a');
                const id = this.ider_slot(data[show].day, data[show].time);
                a.href = `#${id}`;
                a.append(button);
                document.getElementById(id).append(a);
            }
        });
    }
    full(times, offset) {
        const shows = { ...this.shows };
        const data = offset === 0 ? this.store : this.past;
        const output = [];
        for (let i = 0; i < times.length; i++) {
            if (!(times[i].includes('00') || times[i].includes('30'))) {
                Object.keys(shows).some((show) => {
                    if (show in data) {
                        if (data[show].time.includes('00') ||
                            data[show].time.includes('30')) {
                            delete shows[show];
                        }
                        else if (times[i] === data[show].time) {
                            output.push(times[i]);
                            delete shows[show];
                            return 1;
                        }
                    }
                    else
                        delete shows[show];
                    return 0;
                });
            }
            else
                output.push(times[i]);
        }
        return output;
    }
    cutoff(times, offset) {
        const shows = { ...this.shows };
        const data = offset === 0 ? this.store : this.past;
        let max = '12:00 AM';
        let min = '11:59 PM';
        switch (Object.keys(shows).length) {
            case 0:
                return times;
            case 1:
                return [data[Object.keys(shows)[0]].time];
            default:
                Object.keys(shows).forEach((show) => {
                    if (show in data) {
                        [, max] = this.minMax(max, data[show].time);
                        [min] = this.minMax(min, data[show].time);
                        if (data[show].time.includes('00') ||
                            data[show].time.includes('30')) {
                            delete shows[show];
                        }
                    }
                    else
                        delete shows[show];
                });
        }
        const output = [];
        let bool = false;
        for (let i = 0; i <= times.length; i++) {
            if (min === times[i]) {
                output.push(times[i]);
                bool = true;
            }
            else if (max === times[i]) {
                output.push(times[i]);
                break;
            }
            else if (bool) {
                if (times[i].includes('00') || times[i].includes('30')) {
                    output.push(times[i]);
                }
                else {
                    const key = Object.keys(shows).find((show) => times[i] === data[show].time);
                    if (key) {
                        output.push(times[i]);
                        delete shows[key];
                    }
                }
            }
        }
        return output;
    }
    compact(times, offset) {
        const data = offset === 0 ? this.store : this.past;
        const shows = { ...this.shows };
        const output = [];
        for (let i = 0; i < times.length; i++) {
            Object.keys(shows).some((show) => {
                if (show in data && data[show].time === times[i]) {
                    output.push(times[i]);
                    delete shows[show];
                    return 1;
                }
                else if (!(show in data))
                    delete shows[show];
                return 0;
            });
            if (Object.keys(shows).length === 0)
                break;
        }
        return output;
    }
    streamInfo(show) {
        const data = show in this.store ? this.store : this.past;
        const s = document.getElementById('show');
        if (s)
            s.remove();
        let td = document.createElement('td');
        td.id = 'title';
        td.innerHTML = show;
        let tr = document.createElement('tr');
        tr.append(td);
        const tbody = document.createElement('tbody');
        tbody.append(tr);
        const table = document.createElement('table');
        if (Object.keys(data[show].streams).length === 0) {
            td = document.createElement('td');
            td.innerHTML = 'No legal stream available';
            tr = document.createElement('tr');
            tr.append(td);
            tbody.append(tr);
            const img = document.createElement('img');
            img.className = 'icon';
            img.src = 'assets/skull.svg';
            const a = document.createElement('a');
            a.id = '0';
            a.className = 'stream';
            a.onclick = () => this.Stream();
            a.href = '#';
            a.append(img);
            a.innerHTML += ' High Seas';
            td = document.createElement('td');
            td.innerHTML = '1 ';
            td.append(a);
            tr = document.createElement('tr');
            tr.append(td);
            tbody.append(tr);
        }
        else {
            Object.entries(data[show].streams).forEach(([stream, link], index) => {
                const img = document.createElement('img');
                img.className = 'icon';
                switch (stream) {
                    case 'Crunchyroll':
                        img.src = 'assets/crunchyroll.svg';
                        break;
                    case 'Funimation':
                        img.src = 'assets/funimation.svg';
                        break;
                    case 'VRV':
                        img.src = 'assets/vrv.svg';
                        break;
                    case 'AnimeLab':
                        img.src = 'assets/animelab.svg';
                        break;
                    case 'Hulu':
                        img.src = 'assets/hulu.svg';
                        break;
                    case 'HiDive':
                        img.src = 'assets/hidive.svg';
                        break;
                    case 'Wakanim':
                        img.src = 'assets/wakanim.svg';
                        break;
                    case 'YouTube':
                        img.src = 'assets/youtube.svg';
                        break;
                    default:
                        img.src = 'assets/netflix.svg';
                }
                const a = document.createElement('a');
                a.id = index.toString();
                a.href = link;
                a.target = '_blank';
                a.className = 'stream';
                a.onclick = () => this.Stream();
                a.append(img);
                a.innerHTML += ` ${stream}`;
                td = document.createElement('td');
                td.innerHTML = `${index + 1} `;
                td.append(a);
                tr = document.createElement('tr');
                tr.append(td);
                tbody.append(tr);
            });
        }
        table.append(tbody);
        const set = document.createElement('button');
        set.className = 'setter';
        set.onclick = () => this.setter();
        if (show in this.shows) {
            set.id = 'sub';
            set.innerHTML = 'Remove from Your List';
        }
        else {
            set.id = 'add';
            set.innerHTML = 'Add to Your List';
        }
        const reset = document.createElement('button');
        reset.onclick = () => this.Reset();
        reset.id = 'reset';
        reset.innerHTML = 'Reset';
        reset.style.visibility =
            show in this.shows &&
                (this.left.style.visibility === 'visible'
                    ? this.shows[show][0]
                    : this.shows[show][1])
                ? 'visible'
                : 'hidden';
        let output;
        let streams;
        let cover;
        let img;
        const info = localStorage.getItem('info');
        if (info === '1') {
            output = document.createElement('aside');
            output.append(table);
            output.append(set);
            output.append(reset);
        }
        else {
            img = document.createElement('img');
            img.src = data[show].cover;
            cover = document.createElement('div');
            cover.className = 'cover';
            cover.append(img);
            streams = document.createElement('div');
            streams.id = 'streams';
            streams.append(table);
            output = document.createElement('div');
            if (info === '2')
                output.className = 'window';
            output.align = 'center';
            output.append(set);
            output.append(reset);
            output.append(cover);
            output.append(streams);
        }
        output.id = 'show';
        document.getElementById('content').append(output);
        this.resizeCalendar();
        document.getElementById('clear').style.visibility = 'visible';
    }
    updateTime() {
        const time = JSON.parse(localStorage.getItem('time'));
        let now = new Date();
        now = [now.getWeek(), now.getFullYear()];
        if (time != null) {
            if ((now[0] - time[0] === 1 && now[1] === time[1]) ||
                (now[1] - time[1] === 1 && now[0] === 52)) {
                Object.keys(this.shows).forEach((show) => {
                    [this.shows[show][0], this.shows[show][1]] = [
                        false,
                        this.shows[show][0],
                    ];
                });
            }
            else if (now[0] !== time[0] || now[1] !== time[1]) {
                Object.keys(this.shows).forEach((show) => {
                    [this.shows[show][0], this.shows[show][1]] = [false, false];
                });
            }
            localStorage.setItem('shows', JSON.stringify(this.shows));
        }
        localStorage.setItem('time', JSON.stringify(now));
    }
    link(id) {
        const ele = document.getElementById(id);
        if (ele)
            this.Stream();
        if (!ele.href.includes(window.location.host))
            window.open(ele.href);
    }
    Stream() {
        const title = document.getElementById('title').innerHTML;
        if (title in this.shows) {
            this.updateSetter(title, true);
            document.getElementById(this.ider_show(title)).style.color = '#4f4f4f';
            document.getElementById('reset').style.visibility = 'visible';
        }
        localStorage.setItem('shows', JSON.stringify(this.shows));
    }
    updateSetter(title, Bool) {
        this.left.style.visibility === 'visible'
            ? (this.shows[title][0] = Bool)
            : (this.shows[title][1] = Bool);
    }
    Reset() {
        const title = document.getElementById('title').innerHTML;
        this.updateSetter(title, false);
        document.getElementById(this.ider_show(title)).style.color = 'purple';
        document.getElementById('reset').style.visibility = 'hidden';
        localStorage.setItem('shows', JSON.stringify(this.shows));
    }
    arrow() {
        let title = document.getElementById('title');
        if (title) {
            title = title.innerHTML;
            if (document.getElementById('season'))
                document.getElementById('show').remove();
            else if (title in this.shows) {
                document.getElementById('reset').style.visibility = (this.left.style.visibility === 'visible'
                    ? this.shows[title][0]
                    : this.shows[title][1])
                    ? 'visible'
                    : 'hidden';
            }
        }
    }
    setter() {
        const title = document.getElementById('title').innerHTML;
        const setter = document.querySelector('.setter');
        if (setter.id === 'add') {
            const ele = document.getElementById(this.ider_show(title));
            if (ele)
                ele.style.borderColor = '#4f004f';
            setter.innerHTML = 'Remove from Your List';
            setter.id = 'sub';
            this.shows[title] = [false, false];
        }
        else if (title in this.shows) {
            delete this.shows[title];
            document.getElementById('reset').style.visibility = 'hidden';
            document.getElementById(this.ider_show(title)).style.borderColor =
                '#484848';
            setter.innerHTML = 'Add to Your List';
            setter.id = 'add';
        }
        localStorage.setItem('shows', JSON.stringify(this.shows));
        const list = document.getElementById('list');
        if (list.innerHTML === 'Full List') {
            this.left.style.visibility === 'visible' ? this.init() : this.init(-7);
        }
    }
    format() {
        localStorage.setItem('format', document.getElementById('format').value);
        this.left.style.visibility === 'visible' ? this.init() : this.init(-7);
    }
    clear() {
        const show = document.getElementById('show');
        if (show) {
            show.remove();
            document.getElementById('clear').style.visibility = 'hidden';
            this.resizeCalendar();
        }
    }
    Left() {
        if (this.left.style.visibility === 'visible') {
            if (this.right.style.visibility === 'visible') {
                this.left.style.visibility = 'hidden';
                this.init(-7);
            }
            else {
                this.right.style.visibility = 'visible';
                this.left.style.visibility = 'visible';
                this.init();
            }
        }
    }
    Right() {
        if (this.right.style.visibility === 'visible') {
            if (this.left.style.visibility === 'visible') {
                this.right.style.visibility = 'hidden';
                document.getElementById('clear').style.visibility = 'hidden';
                document.getElementById('calendar').remove();
                document.getElementById('month').innerHTML = 'Winter 2021';
                SON.init();
            }
            else {
                this.right.style.visibility = 'visible';
                this.left.style.visibility = 'visible';
                this.init();
            }
        }
    }
    info() {
        localStorage.setItem('info', document.getElementById('info').value);
        if (document.getElementById('title')) {
            this.streamInfo(document.getElementById('title').innerText);
        }
    }
}
