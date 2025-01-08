
(() => {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            window.location.href = "";
        }
        //navigator.cookieEnabled
        var firstGame = false;
        var additional = [true, false, false, false, true];//5个附加选项
        var options = [0, 1, 0, 0, 0, 0];//[保留 占位没实际作用，难度，角色，背景，音符，轨道]
        var name = ['secret base ~君がくれたもの~', '000', '222', '111', '333', '444'];
        var achievement = [
            [[0, 0, 0, 0], [1, 777, 12, 32], [1, 956, 99, 163], [2, 1965, 192, 169], [3, 6532, 623, 623]],
            [[2, 5623, 369, 306], [0, 0, 0, 0], [1, 777, 12, 32], [2, 956, 99, 163], [3, 1965, 192, 169]],
            [[3, 6532, 623, 623], [2, 5623, 369, 306], [0, 0, 0, 0], [1, 777, 12, 32], [1, 956, 99, 163]],
            [[0, 0, 0, 0], [1, 777, 12, 32], [1, 956, 99, 163], [2, 1965, 192, 169], [3, 6532, 623, 623]],
            [[2, 5623, 369, 306], [0, 0, 0, 0], [1, 777, 12, 32], [2, 956, 99, 163], [3, 1965, 192, 169]],
            [[0, 0, 0, 0], [1, 777, 12, 32], [1, 956, 99, 163], [2, 1965, 192, 169], [3, 6532, 623, 623]],
            [[2, 5623, 369, 306], [0, 0, 0, 0], [1, 777, 12, 32], [1, 956, 99, 163], [0, 1965, 192, 169]]
        ];

        let docEl = document.documentElement;
        let w = document.querySelector('.w');
        let noteSpeed = 1000;
        let noteDetermine = 100;
        let globalTimer1 = true;
        let globalTimer2 = true;
        let preload = false;
        let audio = new Audio();
        let SE = new Audio();
        audio.loop = true;

        // #region
        // #endregion


        let choiceMusic = document.querySelector('.choice_music');
        let choiceDifficulty = document.querySelector('.choice_difficulty');
        let areaA = document.querySelectorAll('.choice_music>section');
        let areaB = document.querySelectorAll('.choice_difficulty>section');

        document.documentElement.style.overflow = 'hidden';
        // window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

        class GameConfigLoader {
            constructor(configData) {
                this._configData = configData || loadGameConfig();
                this._songName = [];
                this._songRank = [];
                this._songLink = [];
                this._songCover = [];
                this._songImage = [];
                this._timeAxis = [];
            }
            // #region 读取基础音乐数据
            loadConfigData() {
                return this._configData;
            }
            loadSongMessage(songID) {
                return this._configData[songID];
            }
            loadSongName(song) {
                try {
                    return song.songName;
                } catch (e) {
                    return '未定义名称';
                }
            }
            loadSongRank(song) {
                try {
                    while (song.songRank.length < 5)
                        song.songRank.push(null);
                    song.songRank.length = 5;
                    return song.songRank.map((elem) => {
                        if (isNaN(elem + 0))
                            return null;
                        return elem;
                    });
                } catch (e) {
                    return null;
                }
            }
            loadSongLink(song) {
                try {
                    return song.songLink;
                } catch (e) {
                    return null;
                }
            }
            loadSongCover(song) {
                try {
                    return song.songCover;
                } catch (e) {
                    return './images/null.jpg';
                }
            }
            loadSongImage(song) {
                try {
                    return song.songImage;
                } catch (e) {
                    return './images/null.jpg';
                }
            }
            loadAllSongName() {
                return this._songName;
            }
            loadAllSongRank() {
                return this._songRank
            }
            loadAllSongLink() {
                return this._songLink;
            }
            loadAllSongCover() {
                return this._songCover;
            }
            loadAllSongImage() {
                return this._songImage;
            }
            loadAllSongNote(song) {
                try {
                    if (song.timeAxis.length < 5)
                        song.timeAxis.length = 5;
                    return song.timeAxis.filter((elem, index) => {
                        if (index < 5) {
                            try {
                                return elem.filter((elem) => {
                                    if (elem.noteType != 1 && elem.noteType != 2 && elem.noteType != 3)
                                        elem.noteType = 1;
                                    if ((elem.notePosition == 0 || elem.notePosition == 1 || elem.notePosition == 2 || elem.notePosition == 3 || elem.notePosition == 4 || elem.notePosition == 5 || elem.notePosition == 6) && !isNaN(elem.noteTime))
                                        return elem;
                                })
                            } catch {
                                return null;
                            }
                        }
                    });
                } catch (e) {
                    return null;
                }
            }
            loadSongNote(musicNow, hurdle) {
                return this._timeAxis[musicNow][hurdle];
            }
            loadAll() {
                if (this._configData.length < 3)
                    return 1;
                this._songName = this._configData.map(this.loadSongName, this);
                this._songRank = this._configData.map(this.loadSongRank, this);
                this._songLink = this._configData.map(this.loadSongLink, this);
                this._songCover = this._configData.map(this.loadSongCover, this);
                this._songImage = this._configData.map(this.loadSongImage, this);
                this._songName.unshift('random');
                this._songRank.unshift('?????');
                this._songLink.unshift('');
                this._songCover.unshift('./images/0.jpg');
                this._songImage.unshift('./images/0.jpg');
                this._timeAxis = this._configData.map(this.loadAllSongNote, this);
                this._timeAxis.unshift([]);
                console.log(this._timeAxis);
                // console.log(this._songRank);
            }
            // #endregion
            // #region 初始化音乐选择界面
            settingImage(url, area) {
                area.style.backgroundImage = 'url(' + url + ')';
            }
            resetTitle() {
                let str = '';
                let regex = new RegExp(/\s/);
                let musicTitle = document.querySelector('.music_title');
                for (let i = 0; i < this._songName[1].length; i++)
                    regex.test(this._songName[1][i]) ? str += '<span>&#8192;</span>' : str += '<span>' + this._songName[1][i] + '</span>';
                musicTitle.innerHTML = str;
            }
            resetHurdle() {
                let str1 = `<div class="hurdle display_none">
                <span>ease</span><span>normal</span><span>hard</span><span>expert</span><span>special</span><span>开始</span></div><div class="rank display_none">LV 26</div>`;
                let str2 = `<div class="hurdle slide_in">
                <span>ease</span><span>normal</span><span>hard</span><span>expert</span><span>special</span><span id="start">开始</span></div><div class="rank text_fade_in_2">LV 26</div>`;
                areaA[1].insertAdjacentHTML('beforeend', str1);
                areaA[2].insertAdjacentHTML('beforeend', str2);
                areaA[3].insertAdjacentHTML('beforeend', str1);
                let hurdleMenu = document.querySelectorAll('.hurdle');
                hurdleMenu.forEach((elem) => {
                    if (options[1])
                        elem.children[options[1] - 1].className = 'hurdle_select_prev';
                    elem.children[options[1]].className = 'hurdle_select';
                })
                setTimeout(() => {
                    areaA[2].firstElementChild.className = 'hurdle';
                }, 1000);
            }
            resetAdditional() {
                let str = `<ul class="additional_options">
                <li class="unlock"><span class="transit_text"><span data-slide="判">判</span><span data-slide="定">定</span><span data-slide="稍">稍</span><span data-slide="微">微</span><span data-slide="严">严</span><span data-slide="格">格</span><span data-slide="一">一</span><span data-slide="些">些</span></span><span class="visibility_hidden">cost+2%</span><div class="additional_button">0</div></li>
                <li class="unlock"><span class="transit_text"><span data-slide="判">判</span><span data-slide="定">定</span><span data-slide="更">更</span><span data-slide="加">加</span><span data-slide="严">严</span><span data-slide="格">格</span><span data-slide="一">一</span><span data-slide="些">些</span></span><span class="visibility_hidden">cost+3%</span><div class="additional_button">1</div></li>
                <li class="unlock"><span class="transit_text"><span data-slide="只">只</span><span data-slide="有">有</span><span data-slide="p">p</span><span data-slide="e">e</span><span data-slide="r">r</span><span data-slide="f">f</span><span data-slide="e">e</span><span data-slide="c">c</span><span data-slide="t">t</span><span data-slide="才">才</span><span data-slide="得">得</span><span data-slide="分">分</span></span><span class="visibility_hidden">cost+1%</span><div class="additional_button">2</div></li>
                <li class="unlock"><span class="transit_text"><span data-slide="开">开</span><span data-slide="始">始</span><span data-slide="游">游</span><span data-slide="戏">戏</span><span data-slide="后">后</span><span data-slide="无">无</span><span data-slide="音">音</span><span data-slide="乐">乐</span></span><span class="visibility_hidden">cost+1%</span><div class="additional_button">3</div></li>
                <li class="unlock"><span class="transit_text"><span data-slide="l">l</span><span data-slide="i">i</span><span data-slide="f">f</span><span data-slide="e">e</span><span data-slide="为">为</span><span data-slide="0">0</span><span data-slide="也">也</span><span data-slide="继">继</span><span data-slide="续">续</span><span data-slide="游">游</span><span data-slide="戏">戏</span></span><span class="visibility_hidden">cost+0%</span><div class="additional_button">4</div></li>
            </ul>`;
                areaB[1].insertAdjacentHTML('beforeend', str);
                areaB[4].insertAdjacentHTML('beforeend', str);
                additional.forEach((elem, index) => {
                    if (elem) {
                        areaB[1].firstElementChild.children[index].className = 'lock';
                        areaB[4].firstElementChild.children[index].className = 'lock';
                    }
                })
            }
            resetPersonalRecords() {
                let str = `<ul class="personal_records">
                    <li><div></div><span class="clear_star"><span></span><span></span><span></span><span></span><span></span></span></li>
                    <li><span>成就:</span><span></span></li>
                    <li><span>最高分:</span><span></span></li>
                    <li><span>最大连击:</span><span></span></li>
                    <li><span>最多完美:</span><span></span></li>
                </ul>`;
                areaB[0].insertAdjacentHTML('beforeend', str);
                areaB[3].insertAdjacentHTML('beforeend', str);
                areaB[6].insertAdjacentHTML('beforeend', str);
                let personalRecordsMenu = document.querySelectorAll('.personal_records');
                personalRecordsMenu.forEach((elem) => {
                    this.settingImage(this._songCover[1], elem.children[0]);
                    achievement[1].forEach((elem_, index) => {
                        switch (elem_[0]) {
                            case 0:
                                if (this._songRank[1][index] == null) {
                                    elem.children[0].children[1].children[index].className = 'm_NULL';
                                    break;
                                }
                                elem.children[0].children[1].children[index].className = 'ND';
                                break;
                            case 1:
                                elem.children[0].children[1].children[index].className = 'GC';
                                break;
                            case 2:
                                elem.children[0].children[1].children[index].className = 'FC';
                                break;
                            case 3:
                                elem.children[0].children[1].children[index].className = 'AP';
                                break;
                            default:
                                break;
                        }
                        switch (achievement[1][options[1]][0]) {
                            case 0:
                                elem.children[1].children[1].className = 'no_game_date';
                                break;
                            case 1:
                                elem.children[1].children[1].className = 'game_clear';
                                break;
                            case 2:
                                elem.children[1].children[1].className = 'full_combo';
                                break;
                            case 3:
                                elem.children[1].children[1].className = 'all_perfect';
                                break;
                            default:
                                break;
                        }
                        elem.children[1].children[1].classList.add('text_fade_in');
                        for (let i = 2; i < 5; i++) {
                            elem.children[i].children[1].innerHTML = achievement[1][options[1]][i - 1];
                            elem.children[i].children[1].className = 'text_fade_in';
                        }
                        switch (options[1]) {
                            case 0:
                                elem.children[0].style.boxShadow = `.041667rem .041667rem dodgerblue`;
                                break;
                            case 1:
                                elem.children[0].style.boxShadow = `.041667rem .041667rem lime`;
                                break;
                            case 2:
                                elem.children[0].style.boxShadow = `.041667rem .041667rem orange`;
                                break;
                            case 3:
                                elem.children[0].style.boxShadow = `.041667rem .041667rem red`;
                                break;
                            case 4:
                                elem.children[0].style.boxShadow = `.041667rem .041667rem magenta`;
                                break;
                            default:
                                break;
                        }
                    })
                })
            }
            audioStart(url) {
                audio.pause();
                audio.src = url;
                if (audio.canPlayType('audio/wav')) {
                    audio.currentTime = 2;
                    audio.play();
                }
            }
            resetAudio() {
                this.audioStart(this._songLink[1]);
            }
            selectMenuConstruct() {
                this.settingImage(this._songImage[0], areaA[1]);
                this.settingImage(this._songImage[1], areaA[2]);
                this.settingImage(this._songImage[2], areaA[3]);
                this.resetTitle();
                this.resetHurdle();
                this.resetAdditional();
                this.resetPersonalRecords();
                return 0;
            }
            // #endregion
        }
        class SetScreenManager {
            constructor() {
                this._screenHeight = null;
                this._screenWidth = null;
            }
            setScreen() {
                this._screenHeight = window.innerHeight;
                this._screenWidth = window.innerWidth;
                document.body.style.height = w.style.height = this._screenHeight + 'px';
                document.body.style.width = this._screenWidth + 'px';
            }
            pageshow(e) {
                if (e.persisted) {
                    this.setScreen();
                }
            }
            responsiveSetScreen() {
                this.setScreen();
                window.addEventListener('resize', this.setScreen.bind(this));
                window.addEventListener('pageshow', this.pageshow.bind(this))
            }
        }

        class SelectedMusic extends GameConfigLoader {
            constructor(configData, songName, songRank, songLink, songCover, songImage) {
                super(configData);
                this._songName = songName || null;
                this._songRank = songRank || null;
                this._songLink = songLink || null;
                this._songCover = songCover || null;
                this._songImage = songImage || null;
                this._musicNumber = configData.length;
                this._menuNumber = 3;
                this._musicNow = 1;
                this._menuNow = 3;
                this._musicWheel = null;
                this._menuWheel = null;
                this._hurdleClick = null;
                this._additionalClick = null;
                this._musicTitleList = [];
                this._musicTitle = null;
                this._hurdleMenu = null;
                this._musicRankMenu = null;
                this._additionalMenu = null;
                this._personalRecordsMenu = null;
            }
            SEplay(num) {
                num ? SE.src = './SE/Evasion2_MP3.mp3' :
                    SE.src = './SE/Cursor3_MP3.mp3';
                if (SE.canPlayType('audio/wav')) {
                    SE.play();
                }
            }
            // #region 音乐图片界面滚动效果
            wheelPreload() {
                // if (this._musicNow == this._musicNumber - 1) {
                //     super.settingImage(this._songImage[0], areaA[4]);
                // } else if (this._musicNow == this._musicNumber) {
                //     super.settingImage(this._songImage[1], areaA[4]);
                // } else {
                //     super.settingImage(this._songImage[this._musicNow + 2], areaA[4]);
                // }
                // if (this._musicNow == 1) {
                //     super.settingImage(this._songImage[this._musicNumber], areaA[0]);
                // } else if (!this._musicNow == 0) {
                //     super.settingImage(this._songImage[this._musicNumber - 1], areaA[0]);
                // } else {
                //     super.settingImage(this._songImage[this._musicNow - 2], areaA[0]);
                // }
                // if (this._musicNow == this._musicNumber - 2) {
                //     super.settingImage(this._songImage[0], areaA[4]);
                // } else if (this._musicNow == this._musicNumber - 1) {
                //     super.settingImage(this._songImage[1], areaA[4]);
                // } else {
                //     super.settingImage(this._songImage[this._musicNow + 3], areaA[4]);
                // }
                // if (!this._musicNow - 2) {
                //     super.settingImage(this._songImage[this._musicNumber], areaA[0]);
                // } else if (!this._musicNow - 1) {
                //     super.settingImage(this._songImage[this._musicNumber - 1], areaA[0]);
                // } else {
                //     super.settingImage(this._songImage[this._musicNow - 3], areaA[0]);
                // }
            }
            // 给这段明天就只有上帝才能看懂的超乱代码写点注释好了
            // 这里menu与music用了不同的转法，menu是真的在转，music是假转，只有5个盒子，仅仅是不停地换背景造成在转的感觉
            // 开始是考虑到music图片太多才考虑的这么写，但图片加载延迟太明显了，也懒得删了再改了
            // menu说是“真的”在转，实际上也不完全是，因为转到在此六棱柱中看不见正面的面时就不再转了
            // menu用n+3个盒子也可实现同样功能，我用了n+4个盒子是觉得转的会更流畅，不重复的盒子的个数+全屏最多出现的盒子数-1=最少盒子数(不乱动盒子之间的相对位置为前提)
            setTitle() {
                this._musicTitle.innerHTML = '';
                setTimeout(() => {
                    this._musicTitle.innerHTML = this._musicTitleList[this._musicNow];
                }, 300);
                if (this._menuNow == 2) {
                    this.menuWheelDown();
                } else if (this._menuNow == 4) {
                    this.menuWheelUp();
                }
            }
            upSetCover() {
                let personalRecords = document.querySelectorAll('.personal_records');
                personalRecords.forEach((elem) => {
                    this._musicNow == this._musicNumber ? super.settingImage(this._songCover[0], elem.children[0].children[0]) :
                        super.settingImage(this._songCover[this._musicNow + 1], elem.children[0].children[0]);
                    super.settingImage(this._songCover[this._musicNow], elem.children[0]);
                    elem.children[0].children[0].className = 'fade_out';
                    setTimeout(() => {
                        elem.children[0].children[0].className = '';
                    }, 1000);
                });
            }
            downSetCover() {
                let personalRecords = document.querySelectorAll('.personal_records');
                personalRecords.forEach((elem) => {
                    this._musicNow == 0 ? super.settingImage(this._songCover[this._musicNumber], elem.children[0].children[0]) :
                        super.settingImage(this._songCover[this._musicNow - 1], elem.children[0].children[0]);
                    super.settingImage(this._songCover[this._musicNow], elem.children[0]);
                    elem.children[0].children[0].className = 'fade_out';
                    setTimeout(() => {
                        elem.children[0].children[0].className = '';
                    }, 1000);
                });
            }
            wheelRank(int) {
                this._musicRankMenu.forEach((elem) => {
                    // areaA[int].children[1].classList.remove('text_fade_in_2');
                    areaA[int].children[1].classList.remove('display_none');
                    areaA[int].children[1].classList.add('text_fade_out');
                    areaA[2].children[1].classList.add('display_none');
                    setTimeout(() => {
                        elem.innerHTML = `LV ${this._songRank[this._musicNow][options[1]]}`;
                        areaA[int].children[1].classList.remove('text_fade_out');
                        areaA[int].children[1].classList.add('display_none');
                        areaA[2].children[1].classList.remove('display_none');
                        areaA[2].children[1].classList.add('text_fade_in_2');
                    }, 305);
                })
            }
            wheelStar() {
                this._personalRecordsMenu.forEach((elem) => {
                    achievement[this._musicNow].forEach((elem_, index) => {
                        switch (elem_[0]) {
                            case 0:
                                if (this._songRank[this._musicNow][index] == null) {
                                    elem.children[0].children[1].children[index].className = 'm_NULL';
                                    break;
                                }
                                elem.children[0].children[1].children[index].className = 'ND';
                                break;
                            case 1:
                                elem.children[0].children[1].children[index].className = 'GC';
                                break;
                            case 2:
                                elem.children[0].children[1].children[index].className = 'FC';
                                break;
                            case 3:
                                elem.children[0].children[1].children[index].className = 'AP';
                                break;
                            default:
                                break;
                        }
                    })
                })
            }
            musicWheelUpOrDownCommon() {
                this.setTitle();
                this.costComboEtcFadeIn(options[1]);
                this.wheelRank(3);
                this.wheelStar();
                super.audioStart(this._songLink[this._musicNow]);
            }
            musicWheelUp() {
                if (--this._musicNow < 0) {
                    this._musicNow = this._musicNumber;
                    super.settingImage(this._songImage[0], areaA[3]);
                    super.settingImage(this._songImage[1], areaA[4]);
                } else {
                    this._musicNow == this._musicNumber - 1 ? super.settingImage(this._songImage[0], areaA[4]) :
                        super.settingImage(this._songImage[this._musicNow + 2], areaA[4]);
                    super.settingImage(this._songImage[this._musicNow + 1], areaA[3]);
                }
                this._musicNow == 0 ? super.settingImage(this._songImage[this._musicNumber], areaA[1]) :
                    super.settingImage(this._songImage[this._musicNow - 1], areaA[1]);
                super.settingImage(this._songImage[this._musicNow], areaA[2]);
                areaA[1].className = 'area_a_1 area_1_from_0';
                areaA[2].className = 'area_a_2 area_2_from_1';
                areaA[3].className = 'area_a_3 area_3_from_2';
                areaA[4].className = 'area_a_4 area_4_from_3';
                areaA[2].children[0].className = 'hurdle slide_in';
                areaA[3].children[0].className = 'hurdle slide_out';
                this.upSetCover();
                setTimeout(() => {
                    areaA[1].classList.remove('area_1_from_0');
                    areaA[2].classList.remove('area_2_from_1');
                    areaA[3].classList.remove('area_3_from_2');
                    areaA[4].classList.remove('area_4_from_3');
                    areaA[2].children[0].className = 'hurdle';
                    areaA[3].children[0].className = 'hurdle display_none';
                    // this.wheelPreload();
                }, 1000);
                this.musicWheelUpOrDownCommon();
            }
            musicWheelDown() {
                if (++this._musicNow > this._musicNumber) {
                    this._musicNow = 0;
                    super.settingImage(this._songImage[this._musicNumber - 1], areaA[0]);
                    super.settingImage(this._songImage[this._musicNumber], areaA[1]);
                } else {
                    this._musicNow == 1 ? super.settingImage(this._songImage[this._musicNumber], areaA[0]) :
                        super.settingImage(this._songImage[this._musicNow - 2], areaA[0]);
                    super.settingImage(this._songImage[this._musicNow - 1], areaA[1]);
                }
                this._musicNow == this._musicNumber ? super.settingImage(this._songImage[0], areaA[3]) :
                    super.settingImage(this._songImage[this._musicNow + 1], areaA[3]);
                super.settingImage(this._songImage[this._musicNow], areaA[2]);
                areaA[0].className = 'area_a_0 area_0_from_1';
                areaA[1].className = 'area_a_1 area_1_from_2';
                areaA[2].className = 'area_a_2 area_2_from_3';
                areaA[3].className = 'area_a_3 area_3_from_4';
                areaA[1].children[0].className = 'hurdle slide_out';
                areaA[2].children[0].className = 'hurdle slide_in';
                this.downSetCover();
                setTimeout(() => {
                    areaA[0].classList.remove('area_0_from_1');
                    areaA[1].classList.remove('area_1_from_2');
                    areaA[2].classList.remove('area_2_from_3');
                    areaA[3].classList.remove('area_3_from_4');
                    areaA[1].children[0].className = 'hurdle display_none';
                    areaA[2].children[0].className = 'hurdle';
                    // this.wheelPreload();
                }, 1000);
                this.musicWheelUpOrDownCommon();
            }
            musicWheel(e) {
                if (globalTimer1) {
                    globalTimer1 = false;
                    setTimeout(() => {
                        globalTimer1 = true;
                    }, 1050);
                    e.deltaY > 0 ? this.musicWheelDown() : this.musicWheelUp();
                }
            }
            // #endregion
            // #region 音乐侧边栏滚动效果
            additionalCostSlide() {
                if (this._menuNow == 4) {
                    this._additionalMenu.forEach((elem, intex) => {
                        elem.previousElementSibling.classList.add('slide_in_2');
                        elem.previousElementSibling.classList.remove('visibility_hidden');
                        elem.previousElementSibling.classList.add('visibility_visible');
                        setTimeout(() => {
                            elem.previousElementSibling.classList.remove('slide_in_2');
                        }, 1000);
                    })
                } else {
                    this._additionalMenu.forEach((elem, intex) => {
                        elem.previousElementSibling.classList.add('slide_out_2');
                        setTimeout(() => {
                            elem.previousElementSibling.classList.remove('slide_out_2');
                            elem.previousElementSibling.classList.remove('visibility_visible');
                            elem.previousElementSibling.classList.add('visibility_hidden');
                        }, 1000);
                    })
                }
            }
            menuWheelUp() {
                this._menuNow--;
                if (this._menuNow == 1) {
                    areaB[this._menuNow - 1].className = 'area_b_0';
                    areaB[this._menuNow].className = 'area_b_0';
                    areaB[this._menuNow + 1].className = 'area_b_0';
                    this._menuNow = this._menuNumber + 1;
                }
                areaB[this._menuNow - 1].className = 'area_b_1 area_1_from_0';
                areaB[this._menuNow].className = 'area_b_2 area_2_from_1';
                areaB[this._menuNow + 1].className = 'area_b_3 area_3_from_2';
                areaB[this._menuNow + 2].className = 'area_b_4 area_4_from_3';
                setTimeout(() => {
                    areaB[this._menuNow - 1].classList.remove('area_1_from_0');
                    areaB[this._menuNow].classList.remove('area_2_from_1');
                    areaB[this._menuNow + 1].classList.remove('area_3_from_2');
                    areaB[this._menuNow + 2].classList.remove('area_4_from_3');
                }, 1000);
                this.additionalCostSlide();
            }
            menuWheelDown() {
                if (this._menuNow == this._menuNumber + 1) {
                    areaB[this._menuNow - 1].className = 'area_b_4';
                    areaB[this._menuNow].className = 'area_b_4';
                    areaB[this._menuNow + 1].className = 'area_b_4';
                    this._menuNow = 1;
                }
                this._menuNow++;
                areaB[this._menuNow - 2].className = 'area_b_0 area_0_from_1';
                areaB[this._menuNow - 1].className = 'area_b_1 area_1_from_2';
                areaB[this._menuNow].className = 'area_b_2 area_2_from_3';
                areaB[this._menuNow + 1].className = 'area_b_3 area_3_from_4';
                setTimeout(() => {
                    areaB[this._menuNow - 2].classList.remove('area_0_from_1');
                    areaB[this._menuNow - 1].classList.remove('area_1_from_2');
                    areaB[this._menuNow].classList.remove('area_2_from_3');
                    areaB[this._menuNow + 1].classList.remove('area_3_from_4');
                }, 1000);
                this.additionalCostSlide();
            }
            menuWheel(e) {
                if (globalTimer1) {
                    globalTimer1 = false;
                    setTimeout(() => {
                        globalTimer1 = true;
                    }, 1050);
                    e.deltaY > 0 ? this.menuWheelDown() : this.menuWheelUp();
                }
            }
            // #endregion
            mouseWheelListener() {
                this._musicTitle = document.querySelector('.music_title');
                this._musicTitleList = this._songName.map((elem) => {
                    let str = '';
                    let regex = new RegExp(/\s/);
                    for (let i = 0; i < elem.length; i++)
                        regex.test(elem[i]) ? str += '<span>&#8192;</span>' : str += '<span>' + elem[i] + '</span>';
                    return str;
                });
                this._musicWheel = this.musicWheel.bind(this);
                choiceMusic.addEventListener('wheel', this._musicWheel);
                this._menuWheel = this.menuWheel.bind(this);
                choiceDifficulty.addEventListener('wheel', this._menuWheel);
            }
            // #region 难度 附加项 其他设置的点击转换效果
            rankFadeIn(hurdle) {
                this._musicRankMenu.forEach((elem, index) => {
                    if (index == 1) {
                        elem.className = 'rank text_fade_out';
                        setTimeout(() => {
                            elem.innerHTML = `LV ${this._songRank[this._musicNow][hurdle]}`;
                            elem.className = 'rank text_fade_in_2';
                        }, 310);
                    } else {
                        elem.innerHTML = `LV ${this._songRank[this._musicNow][hurdle]}`;
                    }
                })
            }
            costComboEtcFadeIn(hurdle) {
                this._personalRecordsMenu.forEach((elem) => {
                    elem.children[1].children[1].classList.remove('text_fade_in');
                    elem.children[1].children[1].classList.add('text_fade_out');
                    for (let i = 2; i < 5; i++)
                        elem.children[i].children[1].className = 'text_fade_out';
                    setTimeout(() => {
                        // console.log(this._musicNow);
                        switch (achievement[this._musicNow][hurdle][0]) {
                            case 0:
                                elem.children[1].children[1].className = 'no_game_date';
                                break;
                            case 1:
                                elem.children[1].children[1].className = 'game_clear';
                                break;
                            case 2:
                                elem.children[1].children[1].className = 'full_combo';
                                break;
                            case 3:
                                elem.children[1].children[1].className = 'all_perfect';
                                break;
                            default:
                                break;
                        }
                        elem.children[1].children[1].classList.add('text_fade_in');
                        for (let i = 2; i < 5; i++) {
                            elem.children[i].children[1].innerHTML = achievement[this._musicNow][hurdle][i - 1];
                            elem.children[i].children[1].className = 'text_fade_in';
                        }
                    }, 305);
                })
            }
            setHurdle(old, $new) {
                this._hurdleMenu.forEach((elem) => {
                    if (old)
                        elem.children[old - 1].className = '';
                    if ($new)
                        elem.children[$new - 1].className = 'hurdle_select_prev';
                    elem.children[old].className = 'hurdle_select hurdle_cancel';
                    elem.children[$new].className = 'hurdle_confirm';
                    setTimeout(() => {
                        old == $new - 1 ? elem.children[old].className = 'hurdle_select_prev' : elem.children[old].className = '';
                        elem.children[$new].className = 'hurdle_select';
                    }, 310);
                })
                this.rankFadeIn($new);
                this.costComboEtcFadeIn($new);
                this.SEplay(1);
            }
            setCoverShadowColor(color) {
                this._personalRecordsMenu.forEach((elem) => {
                    elem.children[0].style.boxShadow = `.041667rem .041667rem ${color}`;
                })
            }
            hurdleClick(e) {
                // console.log(this._personalRecordsMenu[0].children[1].children);
                switch (e.target.innerHTML + '') {
                    case '开始':
                        console.log('999');
                        this.SEplay(1);
                        audio.pause();
                        audio.src = this._songLink[this._musicNow];
                        audio.preload = 'metadata';
                        audio.loop = false;
                        audio.currentTime = 0;
                        audio.addEventListener('loadedmetadata', () => {
                            preload = true;
                        })
                        break;
                    case 'ease':
                        if (options[1] == 0)
                            return;
                        this.setHurdle(options[1], 0);
                        this.setCoverShadowColor('dodgerblue');
                        options[1] = 0;
                        break;
                    case 'normal':
                        if (options[1] == 1)
                            return;
                        this.setHurdle(options[1], 1);
                        this.setCoverShadowColor('lime');
                        options[1] = 1;
                        break;
                    case 'hard':
                        if (options[1] == 2)
                            return;
                        this.setHurdle(options[1], 2);
                        this.setCoverShadowColor('orange');
                        options[1] = 2;
                        break;
                    case 'expert':
                        if (options[1] == 3)
                            return;
                        this.setHurdle(options[1], 3);
                        this.setCoverShadowColor('red');
                        options[1] = 3;
                        break;
                    case 'special':
                        if (options[1] == 4)
                            return;
                        this.setHurdle(options[1], 4);
                        this.setCoverShadowColor('magenta');
                        options[1] = 4;
                        break;
                    default:
                        break;
                }
            }
            additionalClick(e) {
                if (additional[e.target.innerHTML] == true) {
                    additional[1] == true && e.target.innerHTML == '0' ?
                        e.target.parentNode.parentNode.children[1].lastElementChild.click() : this.SEplay();
                    e.target.parentNode.className = 'unlock';
                    this._additionalMenu[e.target.innerHTML].parentNode.className = 'unlock';
                    additional[e.target.innerHTML] = false;
                } else {
                    additional[0] == false && e.target.innerHTML == '1' ?
                        e.target.parentNode.parentNode.children[0].lastElementChild.click() : this.SEplay();
                    e.target.parentNode.className = 'lock';
                    this._additionalMenu[e.target.innerHTML].parentNode.className = 'lock';
                    additional[e.target.innerHTML] = true;
                }
            }
            // #endregion
            mouseClickListener() {
                this._additionalMenu = document.querySelectorAll('.additional_button');
                this._hurdleMenu = document.querySelectorAll('.hurdle');
                this._musicRankMenu = document.querySelectorAll('.rank');
                this._personalRecordsMenu = document.querySelectorAll('.personal_records');
                this._hurdleClick = this.hurdleClick.bind(this);
                this._additionalClick = this.additionalClick.bind(this);
                if (globalTimer2) {
                    globalTimer2 = false;
                    setTimeout(() => {
                        globalTimer2 = true;
                    }, 320);
                    this._hurdleMenu[1].addEventListener('click', this._hurdleClick);
                }
                this._additionalMenu.forEach((elem, index) => {
                    if (index > 4)
                        elem.addEventListener('click', this._additionalClick);
                })

            }
        }
        class modalManager {
            constructor() {
                this._modal = null;
                this._musicStage = null
                this._modalCrossSign = null;
                this._modalOverlay = null;
                this._closeModal = null;
            }
            closeModal(callback) {
                this._modal = document.querySelector('.modal');
                this._musicStage = document.querySelector('.music_stage');
                // console.log('01');
                this._modalCrossSign.removeEventListener('mousedown', this._closeModal, { once: true });
                this._modalOverlay.removeEventListener('mousedown', this._closeModal, { once: true });
                this._modal.classList.add('disappear_2');
                this._modal.children[1].classList.add('disappear');
                setTimeout(() => {
                    this._modal.classList.remove('disappear_2');
                    this._modal.children[1].classList.remove('disappear');
                    this._modal.classList.add('display_none');
                    this._musicStage.classList.remove('display_none');
                    this._musicStage.classList.add('appear');
                    setTimeout(() => {
                        this._musicStage.classList.remove('appear');
                    }, 500);
                }, 500);
                try {
                    callback();
                } catch { }
            }
            closeModalListener(callback) {
                this._modalCrossSign = document.querySelector('.modal_cross_sign');
                this._modalOverlay = document.querySelector('.modal_overlay');
                this._closeModal = this.closeModal.bind(this, callback);
                this._modalCrossSign.addEventListener('mousedown', this._closeModal, { once: true });
                this._modalOverlay.addEventListener('mousedown', this._closeModal, { once: true });
            }
        }

        class NoteMapSetInfo {
            constructor(noteMap) {
                this._noteMap = noteMap;
                this._notePositionMap = [];
                this._nowNote = [];
                this._keyPressed = [];
                this._keyRepeat = [];
                this._keyTimer = [];
                this._lis = null;
                // this._audio = null;
            }
            // #region note演出与判定
            showNoteAdd(noteType, notePosition, noteID) {
                switch (noteType) {
                    case 2:
                        this._lis[notePosition].insertAdjacentHTML('afterbegin', '<div class="note_flick visibility_hidden" id="note_' + noteID + '"></div>');
                        break;
                    case 3:
                        this._lis[notePosition].insertAdjacentHTML('afterbegin', '<div class="note_press visibility_hidden" id="note_' + noteID + '"></div>');
                        break;
                    default:
                        this._lis[notePosition].insertAdjacentHTML('afterbegin', '<div class="note_note visibility_hidden" id="note_' + noteID + '"></div>');
                }
            }
            showNoteDescend(noteID) {
                document.getElementById('note_' + noteID).classList.remove('visibility_hidden');
                document.getElementById('note_' + noteID).classList.add('note_descend');
            }
            showNote(note, noteID) {
                this.showNoteAdd(note.noteType, note.notePosition, noteID);
                setTimeout(this.showNoteDescend, note.noteTime - noteSpeed, noteID);
            }
            noteCodeToPosition(code) {
                switch (code) {
                    case 88:
                        return 0;
                    case 67:
                        return 1;
                    case 86:
                        return 2;
                    case 66:
                        return 3;
                    case 78:
                        return 4;
                    case 77:
                        return 5;
                    case 188:
                        return 6;
                    case 32:
                        return 7;
                    default:
                        return 8;
                }
            }
            noteDoubleKeyDown() {
                document.addEventListener("keyup", (e) => {
                    e.stopImmediatePropagation();
                    this._keyPressed[this.noteCodeToPosition(e.keyCode)] = false;
                    this._keyRepeat[this.noteCodeToPosition(e.keyCode)] = false;
                });
                document.addEventListener("keydown", (e) => {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    this._keyPressed[this.noteCodeToPosition(e.keyCode)] = true;
                    if (e.repeat)
                        this._keyRepeat[this.noteCodeToPosition(e.keyCode)] = true;
                    if (!this._keyRepeat[this.noteCodeToPosition(e.keyCode)] && !this._keyTimer[this.noteCodeToPosition(e.keyCode)])
                        this._keyTimer[this.noteCodeToPosition(e.keyCode)] = setTimeout(() => {
                            if (this._keyPressed[this.noteCodeToPosition(e.keyCode)])
                                this._keyRepeat[this.noteCodeToPosition(e.keyCode)] = true;
                            this._keyTimer[this.noteCodeToPosition(e.keyCode)] = 0;
                        }, 250);
                });
            }
            noteNoteGreat(note) {
                if (this._keyPressed[note.notePosition] && !this._keyRepeat[note.notePosition] && !this._keyRepeat[7]) {
                    this._keyPressed[note.notePosition] = false;
                    clearTimeout(note.timer2);
                    clearTimeout(note.timer3);
                    clearTimeout(note.timer4);
                    clearInterval(note.timerLoop1);
                    console.log(note.noteID);
                    console.log('great1');
                }
            }
            noteNotePerfect(note) {
                if (this._keyPressed[note.notePosition] && !this._keyRepeat[note.notePosition] && !this._keyRepeat[7]) {
                    this._keyPressed[note.notePosition] = false;
                    clearTimeout(note.timer3);
                    clearTimeout(note.timer4);
                    clearInterval(note.timerLoop2);
                    console.log(note.noteID);
                    console.log('perfect');
                }
            }
            noteNoteGreat2(note) {
                if (this._keyPressed[note.notePosition] && !this._keyRepeat[note.notePosition] && !this._keyRepeat[7]) {
                    this._keyPressed[note.notePosition] = false;
                    clearTimeout(note.timer4);
                    clearInterval(note.timerLoop3);
                    console.log(note.noteID);
                    console.log('great2');
                }
            }
            noteNoteMiss(note) {
                console.log(note.noteID);
                console.log('miss');
            }
            noteNoteGreatTime(note) {
                note.timerLoop1 = setInterval(this.noteNoteGreat.bind(this, note), 10)
            }
            noteNotePerfectTime(note) {
                clearInterval(note.timerLoop1);
                note.timerLoop2 = setInterval(this.noteNotePerfect.bind(this, note), 10)
            }
            noteNoteGreatTime2(note) {
                clearInterval(note.timerLoop2);
                note.timerLoop3 = setInterval(this.noteNoteGreat2.bind(this, note), 10)
            }
            noteNoteMissTime(note) {
                clearInterval(note.timerLoop3);
                this.noteNoteMiss(note);
            }
            noteNoteJudge(note) {
                note.timer1 = setTimeout(this.noteNoteGreatTime.bind(this), note.noteTime - noteDetermine * 2, note);
                note.timer2 = setTimeout(this.noteNotePerfectTime.bind(this), note.noteTime - noteDetermine, note);
                note.timer3 = setTimeout(this.noteNoteGreatTime2.bind(this), note.noteTime + noteDetermine, note);
                note.timer4 = setTimeout(this.noteNoteMissTime.bind(this), note.noteTime + noteDetermine * 2, note);
            }
            notePressPerfect(note) {
                if (this._keyPressed[note.notePosition]) {
                    clearTimeout(note.timer4);
                    clearInterval(note.timerLoop2);
                    console.log(note.noteID);
                    console.log('perfect');
                }
            }
            notePressMiss(note) {
                console.log(note.noteID);
                console.log('miss');
            }
            notePressPerfectTime(note) {
                note.timerLoop2 = setInterval(this.notePressPerfect.bind(this, note), 10)
            }
            notePressMissTime(note) {
                clearInterval(note.timerLoop2);
                this.noteNoteMiss(note);
            }
            notePressJudge(note) {
                note.timer2 = setTimeout(this.notePressPerfectTime.bind(this), note.noteTime - noteDetermine, note);
                note.timer4 = setTimeout(this.notePressMissTime.bind(this), note.noteTime + noteDetermine, note);
            }
            noteFlickGreat(note) {
                if (this._keyPressed[note.notePosition] && !this._keyRepeat[note.notePosition] && this._keyPressed[7]) {
                    this._keyPressed[note.notePosition] = false;
                    clearTimeout(note.timer2);
                    clearTimeout(note.timer3);
                    clearTimeout(note.timer4);
                    clearInterval(note.timerLoop1);
                    console.log(note.noteID);
                    console.log('great1');
                }
            }
            noteFlickPerfect(note) {
                if (this._keyPressed[note.notePosition] && !this._keyRepeat[note.notePosition] && this._keyRepeat[7]) {
                    this._keyPressed[note.notePosition] = false;
                    clearTimeout(note.timer3);
                    clearTimeout(note.timer4);
                    clearInterval(note.timerLoop2);
                    console.log(note.noteID);
                    console.log('perfect');
                }
            }
            noteFlickGreat2(note) {
                if (this._keyPressed[note.notePosition] && !this._keyRepeat[note.notePosition] && this._keyRepeat[7]) {
                    this._keyPressed[note.notePosition] = false;
                    clearTimeout(note.timer4);
                    clearInterval(note.timerLoop3);
                    console.log(note.noteID);
                    console.log('great2');
                }
            }
            noteFlickMiss(note) {
                console.log(note.noteID);
                console.log('miss');
            }
            noteFlickGreatTime(note) {
                note.timerLoop1 = setInterval(this.noteFlickGreat.bind(this, note), 10)
            }
            noteFlickPerfectTime(note) {
                clearInterval(note.timerLoop1);
                note.timerLoop2 = setInterval(this.noteFlickPerfect.bind(this, note), 10)
            }
            noteFlickGreatTime2(note) {
                clearInterval(note.timerLoop2);
                note.timerLoop3 = setInterval(this.noteFlickGreat2.bind(this, note), 10)
            }
            noteFlickMissTime(note) {
                clearInterval(note.timerLoop3);
                this.noteNoteMiss(note);
            }
            noteFlickJudge(note) {
                note.timer1 = setTimeout(this.noteFlickGreatTime.bind(this), note.noteTime - noteDetermine * 2, note);
                note.timer2 = setTimeout(this.noteFlickPerfectTime.bind(this), note.noteTime - noteDetermine, note);
                note.timer3 = setTimeout(this.noteFlickGreatTime2.bind(this), note.noteTime + noteDetermine, note);
                note.timer4 = setTimeout(this.noteFlickMissTime.bind(this), note.noteTime + noteDetermine * 2, note);
            }
            noteJudge(notePositionAxis, index) {
                // let noteExample = document.getElementById('note_' + notePositionAxis[index].noteID);
                switch (notePositionAxis[index].noteType) {
                    case 2:
                        this.noteFlickJudge(notePositionAxis[index]);
                        break;
                    case 3:
                        this.notePressJudge(notePositionAxis[index]);
                        break;
                    default:
                        this.noteNoteJudge(notePositionAxis[index]);
                }
                if (++index < notePositionAxis.length)
                    this.noteJudge(notePositionAxis, index);

            }
            notePositionJudge(notePositionAxis) {
                if (notePositionAxis.length)
                    this.noteJudge(notePositionAxis, 0);
            }
            noteAllJudge() {
                for (let i = 0; i < 7; i++) {
                    this._notePositionMap[i] = this._noteMap.filter((elem, index) => {
                        if (elem.notePosition == i) {
                            elem.noteID = index;
                            return elem;
                        }
                    })
                }
                console.log(this._notePositionMap);
                console.log(this._noteMap);
                this._notePositionMap.forEach(this.notePositionJudge, this);
            }
            // #endregion

            resetStage() {

            }
            stageShow() {
                // this._audio = new Audio();
                let top = document.getElementById('top');
                top.classList.add('stage_transition');
                setTimeout(() => {
                    document.querySelector('.music_stage').classList.add('display_none');
                    document.querySelector('.main').classList.remove('display_none');
                    this._lis = document.querySelectorAll('.main li');
                    setTimeout(() => {
                        top.classList.remove('stage_transition');
                        let timer = setInterval(() => {
                            if (preload) {
                                preload = false;
                                clearTimeout(timer);
                                audio.play();
                                this._noteMap.forEach(this.showNote, this);
                                this.noteDoubleKeyDown();
                                this.noteAllJudge();
                            }
                        }, 250);
                    }, 3000);
                }, 3000);
            }
        }
        ///////////////////////////////////////////////////arguments.callee

        let $setScreenManager = new SetScreenManager();
        $setScreenManager.responsiveSetScreen();
        let $gameConfigLoader = new GameConfigLoader();
        if ($gameConfigLoader.loadAll()) {
            console.log('err');
        }
        setTimeout(() => {
            let $modalManager = new modalManager();
            $modalManager.closeModalListener($gameConfigLoader.resetAudio.bind($gameConfigLoader));
        }, 1000);
        $gameConfigLoader.selectMenuConstruct();
        let $selectedMusic = new SelectedMusic($gameConfigLoader.loadConfigData(), $gameConfigLoader.loadAllSongName(), $gameConfigLoader.loadAllSongRank(), $gameConfigLoader.loadAllSongLink(), $gameConfigLoader.loadAllSongCover(), $gameConfigLoader.loadAllSongImage());
        $selectedMusic.mouseWheelListener();
        $selectedMusic.mouseClickListener();

        document.getElementById('start').addEventListener('click', () => {
            console.log($gameConfigLoader.loadSongNote($selectedMusic._musicNow, options[1]));
            let $noteMapSetting = new NoteMapSetInfo($gameConfigLoader.loadSongNote($selectedMusic._musicNow, options[1]));
            // console.log($gameConfigLoader);
            $noteMapSetting.stageShow();
        })
        // let $noteMapSetting = new NoteMapSetInfo($gameConfigLoader.loadSongNote($gameConfigLoader.loadSongMessage(0)));
        // console.log($gameConfigLoader);
        // $noteMapSetting.stageShow();

        // const descend = (obj, target, speed, callback) => {
        //     clearInterval(obj.timer);
        //     obj.timer = setInterval(function () {
        //         if (obj.offsetTop >= target) {
        //             clearInterval(obj.timer);
        //             if (callback) {
        //                 callback();
        //             }
        //         }
        //         obj.style.top = obj.offsetTop + speed + 'px';
        //     }, 20);
        // }
        // let note = document.querySelector('.note_note');
        // let line = document.querySelectorAll('.main li');
        // console.log(line);
        // descend(note, line[0].offsetHeight, 15);
        // console.log(line[0].offsetHeight);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////













    })
})();