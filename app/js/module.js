window.console = window.console || {};
window.console.log = window.console.log || function() {};
if ( ! window.snookerModule ) window.snookerModule = {};
if ( ! window.snookerUsers ) window.snookerUsers = [];

snookerModule = (function ($, window) {

    var main = function () {
        var _this = this;

        //начальные события
        this.init = function () {

            _this.init_passwords();

            //Первый клик по кнопки "ввойти"
            $('#login-submit').click(function () {
                _this.first_authorise();
            });

        }

        //чтобы галочки работали напротив авторизации
        this.init_passwords = function () {
            //делаем галочки для входа
            var input_password = $('input[type="text"], input[type="password"]');
            input_password.on('focus', function(){
                $(this).prev().animate({'opacity':'1'},200)
            })

            input_password.on('blur', function(){
                $(this).prev().animate({'opacity':'.5'},200)
            })

            input_password.on('keyup', function(){
                if(!$(this).val() == ''){
                    $(this).next().animate({'opacity':'1','right' : '30'},200)
                } else {
                    $(this).next().animate({'opacity':'0','right' : '20'},200)
                }
            });
        }

        //появление окошка с тробером авторизации
        this.show_authorisation_process = function (type) {
            var shift = (type == 1) ? -320 : -520;
            window_authorization = $(".authent");
            window_authorization.show().animate({right:shift},{easing : 'easeOutQuint' ,duration: 600, queue: false });
            window_authorization.animate({opacity: 1},{duration: 200, queue: false }).addClass('visible');
        }

        //скрытие окошка с тробером авторизации
        this.hide_authorisation_process = function () {
            window_authorization = $(".authent");
            window_authorization.show().animate({right:90},{easing : 'easeOutQuint' ,duration: 600, queue: false });
            window_authorization.animate({opacity: 0},{duration: 200, queue: false }).removeClass('visible').hide();
        }

        //первый пользоваль ввел свой логин и пароль
        this.first_authorise = function () {

            if( !_this.validate_form('.login') ) return;

            //ложим окошко назад
            $('.login').addClass('test');

            //уводим влево
            setTimeout(function(){
                $('.login').addClass('testtwo')
            },300);

            //показываем окошко с анимацией "Авторизация"
            setTimeout(function(){
                _this.show_authorisation_process(1);
            },500);

            //скрытие окошка анимации и возвращение блока назад вправо
            setTimeout(function(){
                _this.hide_authorisation_process();

                //появление второго окна авторизации
                var login_form = $('.login');
                var new_login_form = login_form.clone().addClass('login2');

                login_form.after(new_login_form);
                $('.login2 .title').html('Вход в игру. Игрок 2');
                $('.login2 .avatar img').attr('src', 'images/player2.png');
                $('.login2 input[type=text], .login2 input[type=password]').val('');
                $('.login2 .validation').css({'right' : '0', 'opacity' : '0'});

                setTimeout(function(){
                    $('.login2').removeClass('testtwo');
                },200);

                setTimeout(function(){
                    $('.login2').removeClass('test')

                    //атачим события на вторую авторизацию
                    _this.init_passwords();
                    $('.login2 input[type=submit]').attr('id', 'login-submit2');
                    $('#login-submit2').click(function () {
                        _this.second_authorise();
                    });
                },500);

            },2500);

        }

        //второй пользователь ввел свой логин и пароль
        this.second_authorise = function () {

            if( !_this.validate_form('.login2') ) return;

            //ложим окошко назад
            $('.login2').addClass('test');

            setTimeout(function(){
                _this.show_authorisation_process(2);
            },500);

            setTimeout(function(){
                _this.show_game_window();
                _this.hide_authorisation_process();
            },2500);
        }

        //появление окна с игроками
        this.show_game_window = function () {
            var text_left = '',
                text_right = '';

            text_left = snookerUsers[0].login + '<br>Очков: <span id="total_left">0</span>';
            text_right = snookerUsers[1].login + '<br>Очков: <span id="total_right">0</span>';

            $('.game-board .left .name').html(text_left);
            $('.game-board .right .name').html(text_right);

            //появление окна
            $('.game-board').show().animate({'opacity': '1'}, 100);
            $('.login').fadeOut().remove();

            //атачим события
            $('body .game-board .left .button').click(function () {
                _this.add_score(0);
            });
            $('body .game-board .right .button').click(function () {
                _this.add_score(1);
            });

            //запускаем подсчет добавленных очкой
            setInterval( function () {
                _this.total_scores();
            }, 100 );
        }

        //проверка заполнена ли форма
        this.validate_form = function (form_selector) {
            var form = $(form_selector),
                login = form.find('input[type=text]').val(),
                pass = form.find('input[type=password]').val();

            if(login.length && pass.length) {
                window.snookerUsers.push({
                    'login' : login,
                    'pass' : pass,
                    'scores' : []
                });

                return true;
            } else {
                alert('Логин и пароль должны быть заполнены');
            }

            return false;
        }

        //добавление очков юзерв
        this.add_score = function (user) {

            if(user == 0) {
                var num = parseInt($('body .game-board .left input').val());
                if(num) {
                    window.snookerUsers[0].scores.push({
                        'time' : Math.floor(Date.now() / 1000),
                        'score' : num
                    });
                }
            }

            if(user == 1) {
                var num = parseInt($('body .game-board .right input').val());
                if(num) {
                    window.snookerUsers[1].scores.push({
                        'time' : Math.floor(Date.now() / 1000),
                        'score' : num
                    });
                }
            }

        }

        //пересчет очков у пользователей (запускается в setInterval)
        this.total_scores = function () {

            var user1_score = 0,
                user2_score = 0;

            var s1 = window.snookerUsers[0].scores;
            for(var k in s1) {
                user1_score += parseInt(s1[k].score);
            }

            var s2 = window.snookerUsers[1].scores;
            for(var k in s2) {
                user2_score += parseInt(s2[k].score);
            }

            var old_left = parseInt($('#total_left').html());
            var old_right = parseInt($('#total_right').html());

            if(old_left != user1_score || old_right != user2_score) {
                $('#total_left').html(user1_score);
                $('#total_right').html(user2_score);

                _this.update_history();
            }

        }

        //обновление таблиц с добавленными очками
        this.update_history = function () {
            $('.score-history').html('');

            var s1 = window.snookerUsers[0].scores;
            for(var k in s1) {
                var timestamp = s1[k].time;
                var time = _this.to_time(timestamp);
                var score = s1[k].score;
                var sufix = 'очков';

                switch (score % 10) {
                    case 1:
                        sufix = 'очко';
                        break;
                    case 2:
                        sufix = 'очка';
                        break;
                    case 3:
                        sufix = 'очка';
                        break;
                    case 4:
                        sufix = 'очка';
                        break;
                }

                $('.game-board .left .score-history')
                    .prepend('<li>'+time+': &nbsp; &nbsp; +'+score+' '+sufix+' &nbsp; &nbsp; <a data-time="'+timestamp+
                        '" class="del-score" href="javascript:void(1);"><img src="images/del.png" width="18" height="18" /></a></li>')
            }

            var s2 = window.snookerUsers[1].scores;
            for(var k in s2) {
                var timestamp = s2[k].time;
                var time = _this.to_time(timestamp);
                var score = s2[k].score;
                var sufix = 'очков';

                switch (score % 10) {
                    case 1:
                        sufix = 'очко';
                        break;
                    case 2:
                        sufix = 'очка';
                        break;
                    case 3:
                        sufix = 'очка';
                        break;
                    case 4:
                        sufix = 'очка';
                        break;
                }

                $('.game-board .right .score-history')
                    .prepend('<li>'+time+': &nbsp; &nbsp; +'+score+' '+sufix+' &nbsp; &nbsp; <a data-time="'+timestamp+
                        '" class="del-score" href="javascript:void(1);"><img src="images/del.png" width="18" height="18" /></a></li>')
            }
        }

        //конвертим timestamp в время
        this.to_time = function (unix_timestamp) {
            var date = new Date(unix_timestamp*1000);
            var hours = "0" + date.getHours();
            var minutes = "0" + date.getMinutes();

            return hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);
        }

        //запускаем на выполнение весь наш модуль
        $(document).ready(function () {
            _this.init();
        });
    }
    return new main();
})(jQuery, window);