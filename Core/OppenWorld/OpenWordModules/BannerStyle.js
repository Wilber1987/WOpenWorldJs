//@ts-check

import { css } from "../../WDevCore/WModules/WStyledRender.js";

export const BannerStyle = css`.wrap {
    height: 100%;
}

.banner-body {
    background: #fff;
    //background-image: radial-gradient(circle at center, white 0%, #222 10%, black 60%);
    overflow: hidden;
    height: 100%;
}

.wrap {
    transform-style: preserve-3d;
    perspective: 800px;
}

.tri {
    height: 0;
    width: 0;
    position: absolute;
    top: 50%;
    left: 50%;
}

.tri:nth-child(1) {
    border-top: 27px solid #00ffee;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(180deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim1 10s infinite linear;
    animation-delay: -0.05s;
    opacity: 0;
}

@keyframes anim1 {
    0% {
        opacity: 1;
        transform: rotate(270deg) translate3d(557px, 566px, 1000px) scale(1);
    }
}

.tri:nth-child(2) {
    border-top: 10px solid #00ff9d;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    margin-left: -5px;
    margin-top: -5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(278deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim2 10s infinite linear;
    animation-delay: -0.1s;
    opacity: 0;
}

@keyframes anim2 {
    0% {
        opacity: 1;
        transform: rotate(417deg) translate3d(421px, 9px, 1000px) scale(1);
    }
}

.tri:nth-child(3) {
    border-top: 17px solid aqua;
    border-right: 17px solid transparent;
    border-left: 17px solid transparent;
    margin-left: -8.5px;
    margin-top: -8.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(341deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim3 10s infinite linear;
    animation-delay: -0.15s;
    opacity: 0;
}

@keyframes anim3 {
    0% {
        opacity: 1;
        transform: rotate(511.5deg) translate3d(533px, 905px, 1000px) scale(1);
    }
}

.tri:nth-child(4) {
    border-top: 11px solid #bfff00;
    border-right: 11px solid transparent;
    border-left: 11px solid transparent;
    margin-left: -5.5px;
    margin-top: -5.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(109deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim4 10s infinite linear;
    animation-delay: -0.2s;
    opacity: 0;
}

@keyframes anim4 {
    0% {
        opacity: 1;
        transform: rotate(163.5deg) translate3d(90px, 353px, 1000px) scale(1);
    }
}

.tri:nth-child(5) {
    border-top: 49px solid #5500ff;
    border-right: 49px solid transparent;
    border-left: 49px solid transparent;
    margin-left: -24.5px;
    margin-top: -24.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(328deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim5 10s infinite linear;
    animation-delay: -0.25s;
    opacity: 0;
}

@keyframes anim5 {
    0% {
        opacity: 1;
        transform: rotate(492deg) translate3d(658px, 613px, 1000px) scale(1);
    }
}

.tri:nth-child(6) {
    border-top: 43px solid #b3ff00;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    margin-left: -21.5px;
    margin-top: -21.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(199deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim6 10s infinite linear;
    animation-delay: -0.3s;
    opacity: 0;
}

@keyframes anim6 {
    0% {
        opacity: 1;
        transform: rotate(298.5deg) translate3d(823px, 505px, 1000px) scale(1);
    }
}

.tri:nth-child(7) {
    border-top: 33px solid #00d0ff;
    border-right: 33px solid transparent;
    border-left: 33px solid transparent;
    margin-left: -16.5px;
    margin-top: -16.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(318deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim7 10s infinite linear;
    animation-delay: -0.35s;
    opacity: 0;
}

@keyframes anim7 {
    0% {
        opacity: 1;
        transform: rotate(477deg) translate3d(31px, 376px, 1000px) scale(1);
    }
}

.tri:nth-child(8) {
    border-top: 5px solid #00fffb;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    margin-left: -2.5px;
    margin-top: -2.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(198deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim8 10s infinite linear;
    animation-delay: -0.4s;
    opacity: 0;
}

@keyframes anim8 {
    0% {
        opacity: 1;
        transform: rotate(297deg) translate3d(812px, 889px, 1000px) scale(1);
    }
}

.tri:nth-child(9) {
    border-top: 39px solid #00ffea;
    border-right: 39px solid transparent;
    border-left: 39px solid transparent;
    margin-left: -19.5px;
    margin-top: -19.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(51deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim9 10s infinite linear;
    animation-delay: -0.45s;
    opacity: 0;
}

@keyframes anim9 {
    0% {
        opacity: 1;
        transform: rotate(76.5deg) translate3d(250px, 750px, 1000px) scale(1);
    }
}

.tri:nth-child(10) {
    border-top: 11px solid #77ff00;
    border-right: 11px solid transparent;
    border-left: 11px solid transparent;
    margin-left: -5.5px;
    margin-top: -5.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(95deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim10 10s infinite linear;
    animation-delay: -0.5s;
    opacity: 0;
}

@keyframes anim10 {
    0% {
        opacity: 1;
        transform: rotate(142.5deg) translate3d(875px, 370px, 1000px) scale(1);
    }
}

.tri:nth-child(11) {
    border-top: 48px solid #00ff4d;
    border-right: 48px solid transparent;
    border-left: 48px solid transparent;
    margin-left: -24px;
    margin-top: -24px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(283deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim11 10s infinite linear;
    animation-delay: -0.55s;
    opacity: 0;
}

@keyframes anim11 {
    0% {
        opacity: 1;
        transform: rotate(424.5deg) translate3d(848px, 933px, 1000px) scale(1);
    }
}

.tri:nth-child(12) {
    border-top: 1px solid #ff0048;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(253deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim12 10s infinite linear;
    animation-delay: -0.6s;
    opacity: 0;
}

@keyframes anim12 {
    0% {
        opacity: 1;
        transform: rotate(379.5deg) translate3d(280px, 333px, 1000px) scale(1);
    }
}

.tri:nth-child(13) {
    border-top: 49px solid #ff1500;
    border-right: 49px solid transparent;
    border-left: 49px solid transparent;
    margin-left: -24.5px;
    margin-top: -24.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(38deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim13 10s infinite linear;
    animation-delay: -0.65s;
    opacity: 0;
}

@keyframes anim13 {
    0% {
        opacity: 1;
        transform: rotate(57deg) translate3d(253px, 507px, 1000px) scale(1);
    }
}

.tri:nth-child(14) {
    border-top: 28px solid #ff0055;
    border-right: 28px solid transparent;
    border-left: 28px solid transparent;
    margin-left: -14px;
    margin-top: -14px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(112deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim14 10s infinite linear;
    animation-delay: -0.7s;
    opacity: 0;
}

@keyframes anim14 {
    0% {
        opacity: 1;
        transform: rotate(168deg) translate3d(847px, 864px, 1000px) scale(1);
    }
}

.tri:nth-child(15) {
    border-top: 48px solid #ff8400;
    border-right: 48px solid transparent;
    border-left: 48px solid transparent;
    margin-left: -24px;
    margin-top: -24px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(103deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim15 10s infinite linear;
    animation-delay: -0.75s;
    opacity: 0;
}

@keyframes anim15 {
    0% {
        opacity: 1;
        transform: rotate(154.5deg) translate3d(851px, 894px, 1000px) scale(1);
    }
}

.tri:nth-child(16) {
    border-top: 8px solid #ff007b;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    margin-left: -4px;
    margin-top: -4px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(50deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim16 10s infinite linear;
    animation-delay: -0.8s;
    opacity: 0;
}

@keyframes anim16 {
    0% {
        opacity: 1;
        transform: rotate(75deg) translate3d(950px, 1px, 1000px) scale(1);
    }
}

.tri:nth-child(17) {
    border-top: 13px solid #00ff04;
    border-right: 13px solid transparent;
    border-left: 13px solid transparent;
    margin-left: -6.5px;
    margin-top: -6.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(115deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim17 10s infinite linear;
    animation-delay: -0.85s;
    opacity: 0;
}

@keyframes anim17 {
    0% {
        opacity: 1;
        transform: rotate(172.5deg) translate3d(968px, 933px, 1000px) scale(1);
    }
}

.tri:nth-child(18) {
    border-top: 27px solid #fb00ff;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(162deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim18 10s infinite linear;
    animation-delay: -0.9s;
    opacity: 0;
}

@keyframes anim18 {
    0% {
        opacity: 1;
        transform: rotate(243deg) translate3d(397px, 442px, 1000px) scale(1);
    }
}

.tri:nth-child(19) {
    border-top: 16px solid #00d5ff;
    border-right: 16px solid transparent;
    border-left: 16px solid transparent;
    margin-left: -8px;
    margin-top: -8px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(148deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim19 10s infinite linear;
    animation-delay: -0.95s;
    opacity: 0;
}

@keyframes anim19 {
    0% {
        opacity: 1;
        transform: rotate(222deg) translate3d(337px, 637px, 1000px) scale(1);
    }
}

.tri:nth-child(20) {
    border-top: 6px solid #d5ff00;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    margin-left: -3px;
    margin-top: -3px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(167deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim20 10s infinite linear;
    animation-delay: -1s;
    opacity: 0;
}

@keyframes anim20 {
    0% {
        opacity: 1;
        transform: rotate(250.5deg) translate3d(193px, 827px, 1000px) scale(1);
    }
}

.tri:nth-child(21) {
    border-top: 17px solid #ff00c8;
    border-right: 17px solid transparent;
    border-left: 17px solid transparent;
    margin-left: -8.5px;
    margin-top: -8.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(85deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim21 10s infinite linear;
    animation-delay: -1.05s;
    opacity: 0;
}

@keyframes anim21 {
    0% {
        opacity: 1;
        transform: rotate(127.5deg) translate3d(420px, 225px, 1000px) scale(1);
    }
}

.tri:nth-child(22) {
    border-top: 29px solid #c4ff00;
    border-right: 29px solid transparent;
    border-left: 29px solid transparent;
    margin-left: -14.5px;
    margin-top: -14.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(355deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim22 10s infinite linear;
    animation-delay: -1.1s;
    opacity: 0;
}

@keyframes anim22 {
    0% {
        opacity: 1;
        transform: rotate(532.5deg) translate3d(156px, 21px, 1000px) scale(1);
    }
}

.tri:nth-child(23) {
    border-top: 14px solid #00a6ff;
    border-right: 14px solid transparent;
    border-left: 14px solid transparent;
    margin-left: -7px;
    margin-top: -7px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(244deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim23 10s infinite linear;
    animation-delay: -1.15s;
    opacity: 0;
}

@keyframes anim23 {
    0% {
        opacity: 1;
        transform: rotate(366deg) translate3d(257px, 78px, 1000px) scale(1);
    }
}

.tri:nth-child(24) {
    border-top: 36px solid #1e00ff;
    border-right: 36px solid transparent;
    border-left: 36px solid transparent;
    margin-left: -18px;
    margin-top: -18px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(335deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim24 10s infinite linear;
    animation-delay: -1.2s;
    opacity: 0;
}

@keyframes anim24 {
    0% {
        opacity: 1;
        transform: rotate(502.5deg) translate3d(106px, 873px, 1000px) scale(1);
    }
}

.tri:nth-child(25) {
    border-top: 48px solid #d900ff;
    border-right: 48px solid transparent;
    border-left: 48px solid transparent;
    margin-left: -24px;
    margin-top: -24px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(95deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim25 10s infinite linear;
    animation-delay: -1.25s;
    opacity: 0;
}

@keyframes anim25 {
    0% {
        opacity: 1;
        transform: rotate(142.5deg) translate3d(943px, 568px, 1000px) scale(1);
    }
}

.tri:nth-child(26) {
    border-top: 46px solid #6200ff;
    border-right: 46px solid transparent;
    border-left: 46px solid transparent;
    margin-left: -23px;
    margin-top: -23px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(10deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim26 10s infinite linear;
    animation-delay: -1.3s;
    opacity: 0;
}

@keyframes anim26 {
    0% {
        opacity: 1;
        transform: rotate(15deg) translate3d(98px, 33px, 1000px) scale(1);
    }
}

.tri:nth-child(27) {
    border-top: 28px solid #9900ff;
    border-right: 28px solid transparent;
    border-left: 28px solid transparent;
    margin-left: -14px;
    margin-top: -14px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(47deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim27 10s infinite linear;
    animation-delay: -1.35s;
    opacity: 0;
}

@keyframes anim27 {
    0% {
        opacity: 1;
        transform: rotate(70.5deg) translate3d(494px, 681px, 1000px) scale(1);
    }
}

.tri:nth-child(28) {
    border-top: 10px solid #00ff80;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    margin-left: -5px;
    margin-top: -5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(276deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim28 10s infinite linear;
    animation-delay: -1.4s;
    opacity: 0;
}

@keyframes anim28 {
    0% {
        opacity: 1;
        transform: rotate(414deg) translate3d(529px, 93px, 1000px) scale(1);
    }
}

.tri:nth-child(29) {
    border-top: 34px solid #00e1ff;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(118deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim29 10s infinite linear;
    animation-delay: -1.45s;
    opacity: 0;
}

@keyframes anim29 {
    0% {
        opacity: 1;
        transform: rotate(177deg) translate3d(586px, 102px, 1000px) scale(1);
    }
}

.tri:nth-child(30) {
    border-top: 27px solid #ff1100;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(258deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim30 10s infinite linear;
    animation-delay: -1.5s;
    opacity: 0;
}

@keyframes anim30 {
    0% {
        opacity: 1;
        transform: rotate(387deg) translate3d(113px, 92px, 1000px) scale(1);
    }
}

.tri:nth-child(31) {
    border-top: 19px solid #00ffc4;
    border-right: 19px solid transparent;
    border-left: 19px solid transparent;
    margin-left: -9.5px;
    margin-top: -9.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(290deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim31 10s infinite linear;
    animation-delay: -1.55s;
    opacity: 0;
}

@keyframes anim31 {
    0% {
        opacity: 1;
        transform: rotate(435deg) translate3d(363px, 90px, 1000px) scale(1);
    }
}

.tri:nth-child(32) {
    border-top: 6px solid #c8ff00;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    margin-left: -3px;
    margin-top: -3px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(256deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim32 10s infinite linear;
    animation-delay: -1.6s;
    opacity: 0;
}

@keyframes anim32 {
    0% {
        opacity: 1;
        transform: rotate(384deg) translate3d(787px, 279px, 1000px) scale(1);
    }
}

.tri:nth-child(33) {
    border-top: 48px solid #00ff9d;
    border-right: 48px solid transparent;
    border-left: 48px solid transparent;
    margin-left: -24px;
    margin-top: -24px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(203deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim33 10s infinite linear;
    animation-delay: -1.65s;
    opacity: 0;
}

@keyframes anim33 {
    0% {
        opacity: 1;
        transform: rotate(304.5deg) translate3d(272px, 982px, 1000px) scale(1);
    }
}

.tri:nth-child(34) {
    border-top: 14px solid #00d5ff;
    border-right: 14px solid transparent;
    border-left: 14px solid transparent;
    margin-left: -7px;
    margin-top: -7px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(66deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim34 10s infinite linear;
    animation-delay: -1.7s;
    opacity: 0;
}

@keyframes anim34 {
    0% {
        opacity: 1;
        transform: rotate(99deg) translate3d(906px, 240px, 1000px) scale(1);
    }
}

.tri:nth-child(35) {
    border-top: 3px solid #ff006f;
    border-right: 3px solid transparent;
    border-left: 3px solid transparent;
    margin-left: -1.5px;
    margin-top: -1.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(252deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim35 10s infinite linear;
    animation-delay: -1.75s;
    opacity: 0;
}

@keyframes anim35 {
    0% {
        opacity: 1;
        transform: rotate(378deg) translate3d(635px, 858px, 1000px) scale(1);
    }
}

.tri:nth-child(36) {
    border-top: 41px solid #00ff7b;
    border-right: 41px solid transparent;
    border-left: 41px solid transparent;
    margin-left: -20.5px;
    margin-top: -20.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(341deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim36 10s infinite linear;
    animation-delay: -1.8s;
    opacity: 0;
}

@keyframes anim36 {
    0% {
        opacity: 1;
        transform: rotate(511.5deg) translate3d(541px, 886px, 1000px) scale(1);
    }
}

.tri:nth-child(37) {
    border-top: 30px solid #0088ff;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(184deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim37 10s infinite linear;
    animation-delay: -1.85s;
    opacity: 0;
}

@keyframes anim37 {
    0% {
        opacity: 1;
        transform: rotate(276deg) translate3d(703px, 496px, 1000px) scale(1);
    }
}

.tri:nth-child(38) {
    border-top: 15px solid #004dff;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    margin-left: -7.5px;
    margin-top: -7.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(320deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim38 10s infinite linear;
    animation-delay: -1.9s;
    opacity: 0;
}

@keyframes anim38 {
    0% {
        opacity: 1;
        transform: rotate(480deg) translate3d(848px, 5px, 1000px) scale(1);
    }
}

.tri:nth-child(39) {
    border-top: 10px solid #ff006a;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    margin-left: -5px;
    margin-top: -5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(142deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim39 10s infinite linear;
    animation-delay: -1.95s;
    opacity: 0;
}

@keyframes anim39 {
    0% {
        opacity: 1;
        transform: rotate(213deg) translate3d(533px, 844px, 1000px) scale(1);
    }
}

.tri:nth-child(40) {
    border-top: 17px solid #0099ff;
    border-right: 17px solid transparent;
    border-left: 17px solid transparent;
    margin-left: -8.5px;
    margin-top: -8.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(245deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim40 10s infinite linear;
    animation-delay: -2s;
    opacity: 0;
}

@keyframes anim40 {
    0% {
        opacity: 1;
        transform: rotate(367.5deg) translate3d(510px, 699px, 1000px) scale(1);
    }
}

.tri:nth-child(41) {
    border-top: 42px solid #ff5900;
    border-right: 42px solid transparent;
    border-left: 42px solid transparent;
    margin-left: -21px;
    margin-top: -21px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(46deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim41 10s infinite linear;
    animation-delay: -2.05s;
    opacity: 0;
}

@keyframes anim41 {
    0% {
        opacity: 1;
        transform: rotate(69deg) translate3d(164px, 653px, 1000px) scale(1);
    }
}

.tri:nth-child(42) {
    border-top: 26px solid #ff1100;
    border-right: 26px solid transparent;
    border-left: 26px solid transparent;
    margin-left: -13px;
    margin-top: -13px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(281deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim42 10s infinite linear;
    animation-delay: -2.1s;
    opacity: 0;
}

@keyframes anim42 {
    0% {
        opacity: 1;
        transform: rotate(421.5deg) translate3d(125px, 314px, 1000px) scale(1);
    }
}

.tri:nth-child(43) {
    border-top: 7px solid #00a2ff;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    margin-left: -3.5px;
    margin-top: -3.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(78deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim43 10s infinite linear;
    animation-delay: -2.15s;
    opacity: 0;
}

@keyframes anim43 {
    0% {
        opacity: 1;
        transform: rotate(117deg) translate3d(627px, 464px, 1000px) scale(1);
    }
}

.tri:nth-child(44) {
    border-top: 3px solid #00ff26;
    border-right: 3px solid transparent;
    border-left: 3px solid transparent;
    margin-left: -1.5px;
    margin-top: -1.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(326deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim44 10s infinite linear;
    animation-delay: -2.2s;
    opacity: 0;
}

@keyframes anim44 {
    0% {
        opacity: 1;
        transform: rotate(489deg) translate3d(436px, 617px, 1000px) scale(1);
    }
}

.tri:nth-child(45) {
    border-top: 30px solid #00ff66;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(271deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim45 10s infinite linear;
    animation-delay: -2.25s;
    opacity: 0;
}

@keyframes anim45 {
    0% {
        opacity: 1;
        transform: rotate(406.5deg) translate3d(183px, 674px, 1000px) scale(1);
    }
}

.tri:nth-child(46) {
    border-top: 10px solid #73ff00;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    margin-left: -5px;
    margin-top: -5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(171deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim46 10s infinite linear;
    animation-delay: -2.3s;
    opacity: 0;
}

@keyframes anim46 {
    0% {
        opacity: 1;
        transform: rotate(256.5deg) translate3d(695px, 918px, 1000px) scale(1);
    }
}

.tri:nth-child(47) {
    border-top: 47px solid #ddff00;
    border-right: 47px solid transparent;
    border-left: 47px solid transparent;
    margin-left: -23.5px;
    margin-top: -23.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(284deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim47 10s infinite linear;
    animation-delay: -2.35s;
    opacity: 0;
}

@keyframes anim47 {
    0% {
        opacity: 1;
        transform: rotate(426deg) translate3d(441px, 138px, 1000px) scale(1);
    }
}

.tri:nth-child(48) {
    border-top: 5px solid #15ff00;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    margin-left: -2.5px;
    margin-top: -2.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(47deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim48 10s infinite linear;
    animation-delay: -2.4s;
    opacity: 0;
}

@keyframes anim48 {
    0% {
        opacity: 1;
        transform: rotate(70.5deg) translate3d(618px, 325px, 1000px) scale(1);
    }
}

.tri:nth-child(49) {
    border-top: 39px solid aqua;
    border-right: 39px solid transparent;
    border-left: 39px solid transparent;
    margin-left: -19.5px;
    margin-top: -19.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(49deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim49 10s infinite linear;
    animation-delay: -2.45s;
    opacity: 0;
}

@keyframes anim49 {
    0% {
        opacity: 1;
        transform: rotate(73.5deg) translate3d(183px, 149px, 1000px) scale(1);
    }
}

.tri:nth-child(50) {
    border-top: 8px solid #0051ff;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    margin-left: -4px;
    margin-top: -4px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(347deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim50 10s infinite linear;
    animation-delay: -2.5s;
    opacity: 0;
}

@keyframes anim50 {
    0% {
        opacity: 1;
        transform: rotate(520.5deg) translate3d(996px, 285px, 1000px) scale(1);
    }
}

.tri:nth-child(51) {
    border-top: 37px solid #ff0095;
    border-right: 37px solid transparent;
    border-left: 37px solid transparent;
    margin-left: -18.5px;
    margin-top: -18.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(137deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim51 10s infinite linear;
    animation-delay: -2.55s;
    opacity: 0;
}

@keyframes anim51 {
    0% {
        opacity: 1;
        transform: rotate(205.5deg) translate3d(227px, 820px, 1000px) scale(1);
    }
}

.tri:nth-child(52) {
    border-top: 11px solid #e6ff00;
    border-right: 11px solid transparent;
    border-left: 11px solid transparent;
    margin-left: -5.5px;
    margin-top: -5.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(284deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim52 10s infinite linear;
    animation-delay: -2.6s;
    opacity: 0;
}

@keyframes anim52 {
    0% {
        opacity: 1;
        transform: rotate(426deg) translate3d(15px, 153px, 1000px) scale(1);
    }
}

.tri:nth-child(53) {
    border-top: 30px solid #00c8ff;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(119deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim53 10s infinite linear;
    animation-delay: -2.65s;
    opacity: 0;
}

@keyframes anim53 {
    0% {
        opacity: 1;
        transform: rotate(178.5deg) translate3d(710px, 961px, 1000px) scale(1);
    }
}

.tri:nth-child(54) {
    border-top: 20px solid #2bff00;
    border-right: 20px solid transparent;
    border-left: 20px solid transparent;
    margin-left: -10px;
    margin-top: -10px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(224deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim54 10s infinite linear;
    animation-delay: -2.7s;
    opacity: 0;
}

@keyframes anim54 {
    0% {
        opacity: 1;
        transform: rotate(336deg) translate3d(731px, 45px, 1000px) scale(1);
    }
}

.tri:nth-child(55) {
    border-top: 33px solid #0400ff;
    border-right: 33px solid transparent;
    border-left: 33px solid transparent;
    margin-left: -16.5px;
    margin-top: -16.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(184deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim55 10s infinite linear;
    animation-delay: -2.75s;
    opacity: 0;
}

@keyframes anim55 {
    0% {
        opacity: 1;
        transform: rotate(276deg) translate3d(294px, 714px, 1000px) scale(1);
    }
}

.tri:nth-child(56) {
    border-top: 29px solid #ff0009;
    border-right: 29px solid transparent;
    border-left: 29px solid transparent;
    margin-left: -14.5px;
    margin-top: -14.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(341deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim56 10s infinite linear;
    animation-delay: -2.8s;
    opacity: 0;
}

@keyframes anim56 {
    0% {
        opacity: 1;
        transform: rotate(511.5deg) translate3d(517px, 97px, 1000px) scale(1);
    }
}

.tri:nth-child(57) {
    border-top: 11px solid #ff00cc;
    border-right: 11px solid transparent;
    border-left: 11px solid transparent;
    margin-left: -5.5px;
    margin-top: -5.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(168deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim57 10s infinite linear;
    animation-delay: -2.85s;
    opacity: 0;
}

@keyframes anim57 {
    0% {
        opacity: 1;
        transform: rotate(252deg) translate3d(727px, 398px, 1000px) scale(1);
    }
}

.tri:nth-child(58) {
    border-top: 34px solid #00ff51;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(49deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim58 10s infinite linear;
    animation-delay: -2.9s;
    opacity: 0;
}

@keyframes anim58 {
    0% {
        opacity: 1;
        transform: rotate(73.5deg) translate3d(406px, 744px, 1000px) scale(1);
    }
}

.tri:nth-child(59) {
    border-top: 44px solid #8400ff;
    border-right: 44px solid transparent;
    border-left: 44px solid transparent;
    margin-left: -22px;
    margin-top: -22px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(242deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim59 10s infinite linear;
    animation-delay: -2.95s;
    opacity: 0;
}

@keyframes anim59 {
    0% {
        opacity: 1;
        transform: rotate(363deg) translate3d(442px, 955px, 1000px) scale(1);
    }
}

.tri:nth-child(60) {
    border-top: 22px solid #ffe600;
    border-right: 22px solid transparent;
    border-left: 22px solid transparent;
    margin-left: -11px;
    margin-top: -11px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(84deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim60 10s infinite linear;
    animation-delay: -3s;
    opacity: 0;
}

@keyframes anim60 {
    0% {
        opacity: 1;
        transform: rotate(126deg) translate3d(838px, 57px, 1000px) scale(1);
    }
}

.tri:nth-child(61) {
    border-top: 14px solid #ff00bf;
    border-right: 14px solid transparent;
    border-left: 14px solid transparent;
    margin-left: -7px;
    margin-top: -7px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(140deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim61 10s infinite linear;
    animation-delay: -3.05s;
    opacity: 0;
}

@keyframes anim61 {
    0% {
        opacity: 1;
        transform: rotate(210deg) translate3d(630px, 112px, 1000px) scale(1);
    }
}

.tri:nth-child(62) {
    border-top: 4px solid #66ff00;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    margin-left: -2px;
    margin-top: -2px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(171deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim62 10s infinite linear;
    animation-delay: -3.1s;
    opacity: 0;
}

@keyframes anim62 {
    0% {
        opacity: 1;
        transform: rotate(256.5deg) translate3d(67px, 955px, 1000px) scale(1);
    }
}

.tri:nth-child(63) {
    border-top: 27px solid #5eff00;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(63deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim63 10s infinite linear;
    animation-delay: -3.15s;
    opacity: 0;
}

@keyframes anim63 {
    0% {
        opacity: 1;
        transform: rotate(94.5deg) translate3d(129px, 455px, 1000px) scale(1);
    }
}

.tri:nth-child(64) {
    border-top: 27px solid #ffae00;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(94deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim64 10s infinite linear;
    animation-delay: -3.2s;
    opacity: 0;
}

@keyframes anim64 {
    0% {
        opacity: 1;
        transform: rotate(141deg) translate3d(625px, 111px, 1000px) scale(1);
    }
}

.tri:nth-child(65) {
    border-top: 5px solid #ff8000;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    margin-left: -2.5px;
    margin-top: -2.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(159deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim65 10s infinite linear;
    animation-delay: -3.25s;
    opacity: 0;
}

@keyframes anim65 {
    0% {
        opacity: 1;
        transform: rotate(238.5deg) translate3d(972px, 362px, 1000px) scale(1);
    }
}

.tri:nth-child(66) {
    border-top: 39px solid #bbff00;
    border-right: 39px solid transparent;
    border-left: 39px solid transparent;
    margin-left: -19.5px;
    margin-top: -19.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(304deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim66 10s infinite linear;
    animation-delay: -3.3s;
    opacity: 0;
}

@keyframes anim66 {
    0% {
        opacity: 1;
        transform: rotate(456deg) translate3d(535px, 942px, 1000px) scale(1);
    }
}

.tri:nth-child(67) {
    border-top: 45px solid #00fffb;
    border-right: 45px solid transparent;
    border-left: 45px solid transparent;
    margin-left: -22.5px;
    margin-top: -22.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(146deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim67 10s infinite linear;
    animation-delay: -3.35s;
    opacity: 0;
}

@keyframes anim67 {
    0% {
        opacity: 1;
        transform: rotate(219deg) translate3d(805px, 200px, 1000px) scale(1);
    }
}

.tri:nth-child(68) {
    border-top: 27px solid #40ff00;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(1deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim68 10s infinite linear;
    animation-delay: -3.4s;
    opacity: 0;
}

@keyframes anim68 {
    0% {
        opacity: 1;
        transform: rotate(1.5deg) translate3d(331px, 107px, 1000px) scale(1);
    }
}

.tri:nth-child(69) {
    border-top: 5px solid #00e6ff;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    margin-left: -2.5px;
    margin-top: -2.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(241deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim69 10s infinite linear;
    animation-delay: -3.45s;
    opacity: 0;
}

@keyframes anim69 {
    0% {
        opacity: 1;
        transform: rotate(361.5deg) translate3d(52px, 376px, 1000px) scale(1);
    }
}

.tri:nth-child(70) {
    border-top: 20px solid #aeff00;
    border-right: 20px solid transparent;
    border-left: 20px solid transparent;
    margin-left: -10px;
    margin-top: -10px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(347deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim70 10s infinite linear;
    animation-delay: -3.5s;
    opacity: 0;
}

@keyframes anim70 {
    0% {
        opacity: 1;
        transform: rotate(520.5deg) translate3d(266px, 282px, 1000px) scale(1);
    }
}

.tri:nth-child(71) {
    border-top: 34px solid #00ff48;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(356deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim71 10s infinite linear;
    animation-delay: -3.55s;
    opacity: 0;
}

@keyframes anim71 {
    0% {
        opacity: 1;
        transform: rotate(534deg) translate3d(915px, 78px, 1000px) scale(1);
    }
}

.tri:nth-child(72) {
    border-top: 23px solid #ff4d00;
    border-right: 23px solid transparent;
    border-left: 23px solid transparent;
    margin-left: -11.5px;
    margin-top: -11.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(241deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim72 10s infinite linear;
    animation-delay: -3.6s;
    opacity: 0;
}

@keyframes anim72 {
    0% {
        opacity: 1;
        transform: rotate(361.5deg) translate3d(467px, 617px, 1000px) scale(1);
    }
}

.tri:nth-child(73) {
    border-top: 27px solid #ff0095;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(97deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim73 10s infinite linear;
    animation-delay: -3.65s;
    opacity: 0;
}

@keyframes anim73 {
    0% {
        opacity: 1;
        transform: rotate(145.5deg) translate3d(914px, 297px, 1000px) scale(1);
    }
}

.tri:nth-child(74) {
    border-top: 46px solid #6200ff;
    border-right: 46px solid transparent;
    border-left: 46px solid transparent;
    margin-left: -23px;
    margin-top: -23px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(342deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim74 10s infinite linear;
    animation-delay: -3.7s;
    opacity: 0;
}

@keyframes anim74 {
    0% {
        opacity: 1;
        transform: rotate(513deg) translate3d(707px, 657px, 1000px) scale(1);
    }
}

.tri:nth-child(75) {
    border-top: 43px solid #0066ff;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    margin-left: -21.5px;
    margin-top: -21.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(303deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim75 10s infinite linear;
    animation-delay: -3.75s;
    opacity: 0;
}

@keyframes anim75 {
    0% {
        opacity: 1;
        transform: rotate(454.5deg) translate3d(340px, 564px, 1000px) scale(1);
    }
}

.tri:nth-child(76) {
    border-top: 17px solid #0009ff;
    border-right: 17px solid transparent;
    border-left: 17px solid transparent;
    margin-left: -8.5px;
    margin-top: -8.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(238deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim76 10s infinite linear;
    animation-delay: -3.8s;
    opacity: 0;
}

@keyframes anim76 {
    0% {
        opacity: 1;
        transform: rotate(357deg) translate3d(890px, 257px, 1000px) scale(1);
    }
}

.tri:nth-child(77) {
    border-top: 26px solid #005eff;
    border-right: 26px solid transparent;
    border-left: 26px solid transparent;
    margin-left: -13px;
    margin-top: -13px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(172deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim77 10s infinite linear;
    animation-delay: -3.85s;
    opacity: 0;
}

@keyframes anim77 {
    0% {
        opacity: 1;
        transform: rotate(258deg) translate3d(366px, 12px, 1000px) scale(1);
    }
}

.tri:nth-child(78) {
    border-top: 49px solid #ff0062;
    border-right: 49px solid transparent;
    border-left: 49px solid transparent;
    margin-left: -24.5px;
    margin-top: -24.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(266deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim78 10s infinite linear;
    animation-delay: -3.9s;
    opacity: 0;
}

@keyframes anim78 {
    0% {
        opacity: 1;
        transform: rotate(399deg) translate3d(695px, 652px, 1000px) scale(1);
    }
}

.tri:nth-child(79) {
    border-top: 43px solid #00ff15;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    margin-left: -21.5px;
    margin-top: -21.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(130deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim79 10s infinite linear;
    animation-delay: -3.95s;
    opacity: 0;
}

@keyframes anim79 {
    0% {
        opacity: 1;
        transform: rotate(195deg) translate3d(558px, 278px, 1000px) scale(1);
    }
}

.tri:nth-child(80) {
    border-top: 33px solid #0051ff;
    border-right: 33px solid transparent;
    border-left: 33px solid transparent;
    margin-left: -16.5px;
    margin-top: -16.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(34deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim80 10s infinite linear;
    animation-delay: -4s;
    opacity: 0;
}

@keyframes anim80 {
    0% {
        opacity: 1;
        transform: rotate(51deg) translate3d(153px, 612px, 1000px) scale(1);
    }
}

.tri:nth-child(81) {
    border-top: 19px solid #b700ff;
    border-right: 19px solid transparent;
    border-left: 19px solid transparent;
    margin-left: -9.5px;
    margin-top: -9.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(172deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim81 10s infinite linear;
    animation-delay: -4.05s;
    opacity: 0;
}

@keyframes anim81 {
    0% {
        opacity: 1;
        transform: rotate(258deg) translate3d(794px, 67px, 1000px) scale(1);
    }
}

.tri:nth-child(82) {
    border-top: 15px solid #2b00ff;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    margin-left: -7.5px;
    margin-top: -7.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(193deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim82 10s infinite linear;
    animation-delay: -4.1s;
    opacity: 0;
}

@keyframes anim82 {
    0% {
        opacity: 1;
        transform: rotate(289.5deg) translate3d(197px, 856px, 1000px) scale(1);
    }
}

.tri:nth-child(83) {
    border-top: 44px solid #40ff00;
    border-right: 44px solid transparent;
    border-left: 44px solid transparent;
    margin-left: -22px;
    margin-top: -22px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(83deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim83 10s infinite linear;
    animation-delay: -4.15s;
    opacity: 0;
}

@keyframes anim83 {
    0% {
        opacity: 1;
        transform: rotate(124.5deg) translate3d(121px, 431px, 1000px) scale(1);
    }
}

.tri:nth-child(84) {
    border-top: 34px solid #a2ff00;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(85deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim84 10s infinite linear;
    animation-delay: -4.2s;
    opacity: 0;
}

@keyframes anim84 {
    0% {
        opacity: 1;
        transform: rotate(127.5deg) translate3d(962px, 457px, 1000px) scale(1);
    }
}

.tri:nth-child(85) {
    border-top: 44px solid #d900ff;
    border-right: 44px solid transparent;
    border-left: 44px solid transparent;
    margin-left: -22px;
    margin-top: -22px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(84deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim85 10s infinite linear;
    animation-delay: -4.25s;
    opacity: 0;
}

@keyframes anim85 {
    0% {
        opacity: 1;
        transform: rotate(126deg) translate3d(786px, 320px, 1000px) scale(1);
    }
}

.tri:nth-child(86) {
    border-top: 30px solid #ff4400;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(235deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim86 10s infinite linear;
    animation-delay: -4.3s;
    opacity: 0;
}

@keyframes anim86 {
    0% {
        opacity: 1;
        transform: rotate(352.5deg) translate3d(957px, 151px, 1000px) scale(1);
    }
}

.tri:nth-child(87) {
    border-top: 30px solid #09ff00;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(116deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim87 10s infinite linear;
    animation-delay: -4.35s;
    opacity: 0;
}

@keyframes anim87 {
    0% {
        opacity: 1;
        transform: rotate(174deg) translate3d(62px, 30px, 1000px) scale(1);
    }
}

.tri:nth-child(88) {
    border-top: 21px solid #00ff26;
    border-right: 21px solid transparent;
    border-left: 21px solid transparent;
    margin-left: -10.5px;
    margin-top: -10.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(196deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim88 10s infinite linear;
    animation-delay: -4.4s;
    opacity: 0;
}

@keyframes anim88 {
    0% {
        opacity: 1;
        transform: rotate(294deg) translate3d(405px, 450px, 1000px) scale(1);
    }
}

.tri:nth-child(89) {
    border-top: 39px solid #aa00ff;
    border-right: 39px solid transparent;
    border-left: 39px solid transparent;
    margin-left: -19.5px;
    margin-top: -19.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(274deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim89 10s infinite linear;
    animation-delay: -4.45s;
    opacity: 0;
}

@keyframes anim89 {
    0% {
        opacity: 1;
        transform: rotate(411deg) translate3d(981px, 929px, 1000px) scale(1);
    }
}

.tri:nth-child(90) {
    border-top: 29px solid #0011ff;
    border-right: 29px solid transparent;
    border-left: 29px solid transparent;
    margin-left: -14.5px;
    margin-top: -14.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(141deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim90 10s infinite linear;
    animation-delay: -4.5s;
    opacity: 0;
}

@keyframes anim90 {
    0% {
        opacity: 1;
        transform: rotate(211.5deg) translate3d(828px, 496px, 1000px) scale(1);
    }
}

.tri:nth-child(91) {
    border-top: 34px solid #ee00ff;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(54deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim91 10s infinite linear;
    animation-delay: -4.55s;
    opacity: 0;
}

@keyframes anim91 {
    0% {
        opacity: 1;
        transform: rotate(81deg) translate3d(886px, 555px, 1000px) scale(1);
    }
}

.tri:nth-child(92) {
    border-top: 40px solid #ff3c00;
    border-right: 40px solid transparent;
    border-left: 40px solid transparent;
    margin-left: -20px;
    margin-top: -20px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(307deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim92 10s infinite linear;
    animation-delay: -4.6s;
    opacity: 0;
}

@keyframes anim92 {
    0% {
        opacity: 1;
        transform: rotate(460.5deg) translate3d(60px, 744px, 1000px) scale(1);
    }
}

.tri:nth-child(93) {
    border-top: 25px solid #2f00ff;
    border-right: 25px solid transparent;
    border-left: 25px solid transparent;
    margin-left: -12.5px;
    margin-top: -12.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(133deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim93 10s infinite linear;
    animation-delay: -4.65s;
    opacity: 0;
}

@keyframes anim93 {
    0% {
        opacity: 1;
        transform: rotate(199.5deg) translate3d(365px, 164px, 1000px) scale(1);
    }
}

.tri:nth-child(94) {
    border-top: 41px solid #00ff66;
    border-right: 41px solid transparent;
    border-left: 41px solid transparent;
    margin-left: -20.5px;
    margin-top: -20.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(34deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim94 10s infinite linear;
    animation-delay: -4.7s;
    opacity: 0;
}

@keyframes anim94 {
    0% {
        opacity: 1;
        transform: rotate(51deg) translate3d(863px, 634px, 1000px) scale(1);
    }
}

.tri:nth-child(95) {
    border-top: 24px solid #0026ff;
    border-right: 24px solid transparent;
    border-left: 24px solid transparent;
    margin-left: -12px;
    margin-top: -12px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(165deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim95 10s infinite linear;
    animation-delay: -4.75s;
    opacity: 0;
}

@keyframes anim95 {
    0% {
        opacity: 1;
        transform: rotate(247.5deg) translate3d(290px, 795px, 1000px) scale(1);
    }
}

.tri:nth-child(96) {
    border-top: 35px solid #002fff;
    border-right: 35px solid transparent;
    border-left: 35px solid transparent;
    margin-left: -17.5px;
    margin-top: -17.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(177deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim96 10s infinite linear;
    animation-delay: -4.8s;
    opacity: 0;
}

@keyframes anim96 {
    0% {
        opacity: 1;
        transform: rotate(265.5deg) translate3d(876px, 929px, 1000px) scale(1);
    }
}

.tri:nth-child(97) {
    border-top: 13px solid #0009ff;
    border-right: 13px solid transparent;
    border-left: 13px solid transparent;
    margin-left: -6.5px;
    margin-top: -6.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(71deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim97 10s infinite linear;
    animation-delay: -4.85s;
    opacity: 0;
}

@keyframes anim97 {
    0% {
        opacity: 1;
        transform: rotate(106.5deg) translate3d(49px, 6px, 1000px) scale(1);
    }
}

.tri:nth-child(98) {
    border-top: 6px solid #ff00e6;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    margin-left: -3px;
    margin-top: -3px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(153deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim98 10s infinite linear;
    animation-delay: -4.9s;
    opacity: 0;
}

@keyframes anim98 {
    0% {
        opacity: 1;
        transform: rotate(229.5deg) translate3d(632px, 691px, 1000px) scale(1);
    }
}

.tri:nth-child(99) {
    border-top: 38px solid #ffb700;
    border-right: 38px solid transparent;
    border-left: 38px solid transparent;
    margin-left: -19px;
    margin-top: -19px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(353deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim99 10s infinite linear;
    animation-delay: -4.95s;
    opacity: 0;
}

@keyframes anim99 {
    0% {
        opacity: 1;
        transform: rotate(529.5deg) translate3d(432px, 965px, 1000px) scale(1);
    }
}

.tri:nth-child(100) {
    border-top: 22px solid #006aff;
    border-right: 22px solid transparent;
    border-left: 22px solid transparent;
    margin-left: -11px;
    margin-top: -11px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(180deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim100 10s infinite linear;
    animation-delay: -5s;
    opacity: 0;
}

@keyframes anim100 {
    0% {
        opacity: 1;
        transform: rotate(270deg) translate3d(368px, 277px, 1000px) scale(1);
    }
}

.tri:nth-child(101) {
    border-top: 31px solid #0400ff;
    border-right: 31px solid transparent;
    border-left: 31px solid transparent;
    margin-left: -15.5px;
    margin-top: -15.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(119deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim101 10s infinite linear;
    animation-delay: -5.05s;
    opacity: 0;
}

@keyframes anim101 {
    0% {
        opacity: 1;
        transform: rotate(178.5deg) translate3d(837px, 437px, 1000px) scale(1);
    }
}

.tri:nth-child(102) {
    border-top: 37px solid #0062ff;
    border-right: 37px solid transparent;
    border-left: 37px solid transparent;
    margin-left: -18.5px;
    margin-top: -18.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(229deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim102 10s infinite linear;
    animation-delay: -5.1s;
    opacity: 0;
}

@keyframes anim102 {
    0% {
        opacity: 1;
        transform: rotate(343.5deg) translate3d(975px, 420px, 1000px) scale(1);
    }
}

.tri:nth-child(103) {
    border-top: 34px solid #0077ff;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(94deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim103 10s infinite linear;
    animation-delay: -5.15s;
    opacity: 0;
}

@keyframes anim103 {
    0% {
        opacity: 1;
        transform: rotate(141deg) translate3d(933px, 316px, 1000px) scale(1);
    }
}

.tri:nth-child(104) {
    border-top: 25px solid #ff004d;
    border-right: 25px solid transparent;
    border-left: 25px solid transparent;
    margin-left: -12.5px;
    margin-top: -12.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(263deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim104 10s infinite linear;
    animation-delay: -5.2s;
    opacity: 0;
}

@keyframes anim104 {
    0% {
        opacity: 1;
        transform: rotate(394.5deg) translate3d(86px, 894px, 1000px) scale(1);
    }
}

.tri:nth-child(105) {
    border-top: 18px solid #62ff00;
    border-right: 18px solid transparent;
    border-left: 18px solid transparent;
    margin-left: -9px;
    margin-top: -9px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(33deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim105 10s infinite linear;
    animation-delay: -5.25s;
    opacity: 0;
}

@keyframes anim105 {
    0% {
        opacity: 1;
        transform: rotate(49.5deg) translate3d(971px, 922px, 1000px) scale(1);
    }
}

.tri:nth-child(106) {
    border-top: 7px solid #00fff2;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    margin-left: -3.5px;
    margin-top: -3.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(83deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim106 10s infinite linear;
    animation-delay: -5.3s;
    opacity: 0;
}

@keyframes anim106 {
    0% {
        opacity: 1;
        transform: rotate(124.5deg) translate3d(724px, 908px, 1000px) scale(1);
    }
}

.tri:nth-child(107) {
    border-top: 41px solid #cc00ff;
    border-right: 41px solid transparent;
    border-left: 41px solid transparent;
    margin-left: -20.5px;
    margin-top: -20.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(25deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim107 10s infinite linear;
    animation-delay: -5.35s;
    opacity: 0;
}

@keyframes anim107 {
    0% {
        opacity: 1;
        transform: rotate(37.5deg) translate3d(992px, 449px, 1000px) scale(1);
    }
}

.tri:nth-child(108) {
    border-top: 41px solid #bbff00;
    border-right: 41px solid transparent;
    border-left: 41px solid transparent;
    margin-left: -20.5px;
    margin-top: -20.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(121deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim108 10s infinite linear;
    animation-delay: -5.4s;
    opacity: 0;
}

@keyframes anim108 {
    0% {
        opacity: 1;
        transform: rotate(181.5deg) translate3d(211px, 440px, 1000px) scale(1);
    }
}

.tri:nth-child(109) {
    border-top: 27px solid #004dff;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(313deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim109 10s infinite linear;
    animation-delay: -5.45s;
    opacity: 0;
}

@keyframes anim109 {
    0% {
        opacity: 1;
        transform: rotate(469.5deg) translate3d(398px, 203px, 1000px) scale(1);
    }
}

.tri:nth-child(110) {
    border-top: 22px solid #003cff;
    border-right: 22px solid transparent;
    border-left: 22px solid transparent;
    margin-left: -11px;
    margin-top: -11px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(77deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim110 10s infinite linear;
    animation-delay: -5.5s;
    opacity: 0;
}

@keyframes anim110 {
    0% {
        opacity: 1;
        transform: rotate(115.5deg) translate3d(540px, 780px, 1000px) scale(1);
    }
}

.tri:nth-child(111) {
    border-top: 1px solid #0040ff;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(247deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim111 10s infinite linear;
    animation-delay: -5.55s;
    opacity: 0;
}

@keyframes anim111 {
    0% {
        opacity: 1;
        transform: rotate(370.5deg) translate3d(557px, 338px, 1000px) scale(1);
    }
}

.tri:nth-child(112) {
    border-top: 5px solid #002bff;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    margin-left: -2.5px;
    margin-top: -2.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(222deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim112 10s infinite linear;
    animation-delay: -5.6s;
    opacity: 0;
}

@keyframes anim112 {
    0% {
        opacity: 1;
        transform: rotate(333deg) translate3d(327px, 258px, 1000px) scale(1);
    }
}

.tri:nth-child(113) {
    border-top: 36px solid #00ff22;
    border-right: 36px solid transparent;
    border-left: 36px solid transparent;
    margin-left: -18px;
    margin-top: -18px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(352deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim113 10s infinite linear;
    animation-delay: -5.65s;
    opacity: 0;
}

@keyframes anim113 {
    0% {
        opacity: 1;
        transform: rotate(528deg) translate3d(868px, 451px, 1000px) scale(1);
    }
}

.tri:nth-child(114) {
    border-top: 34px solid #ffbf00;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(44deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim114 10s infinite linear;
    animation-delay: -5.7s;
    opacity: 0;
}

@keyframes anim114 {
    0% {
        opacity: 1;
        transform: rotate(66deg) translate3d(331px, 612px, 1000px) scale(1);
    }
}

.tri:nth-child(115) {
    border-top: 47px solid #00c4ff;
    border-right: 47px solid transparent;
    border-left: 47px solid transparent;
    margin-left: -23.5px;
    margin-top: -23.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(312deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim115 10s infinite linear;
    animation-delay: -5.75s;
    opacity: 0;
}

@keyframes anim115 {
    0% {
        opacity: 1;
        transform: rotate(468deg) translate3d(214px, 820px, 1000px) scale(1);
    }
}

.tri:nth-child(116) {
    border-top: 30px solid #ff00c8;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(84deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim116 10s infinite linear;
    animation-delay: -5.8s;
    opacity: 0;
}

@keyframes anim116 {
    0% {
        opacity: 1;
        transform: rotate(126deg) translate3d(726px, 19px, 1000px) scale(1);
    }
}

.tri:nth-child(117) {
    border-top: 25px solid #00ff88;
    border-right: 25px solid transparent;
    border-left: 25px solid transparent;
    margin-left: -12.5px;
    margin-top: -12.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(153deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim117 10s infinite linear;
    animation-delay: -5.85s;
    opacity: 0;
}

@keyframes anim117 {
    0% {
        opacity: 1;
        transform: rotate(229.5deg) translate3d(367px, 369px, 1000px) scale(1);
    }
}

.tri:nth-child(118) {
    border-top: 1px solid #ff0033;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(248deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim118 10s infinite linear;
    animation-delay: -5.9s;
    opacity: 0;
}

@keyframes anim118 {
    0% {
        opacity: 1;
        transform: rotate(372deg) translate3d(510px, 55px, 1000px) scale(1);
    }
}

.tri:nth-child(119) {
    border-top: 39px solid #a6ff00;
    border-right: 39px solid transparent;
    border-left: 39px solid transparent;
    margin-left: -19.5px;
    margin-top: -19.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(217deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim119 10s infinite linear;
    animation-delay: -5.95s;
    opacity: 0;
}

@keyframes anim119 {
    0% {
        opacity: 1;
        transform: rotate(325.5deg) translate3d(749px, 620px, 1000px) scale(1);
    }
}

.tri:nth-child(120) {
    border-top: 48px solid #00fbff;
    border-right: 48px solid transparent;
    border-left: 48px solid transparent;
    margin-left: -24px;
    margin-top: -24px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(254deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim120 10s infinite linear;
    animation-delay: -6s;
    opacity: 0;
}

@keyframes anim120 {
    0% {
        opacity: 1;
        transform: rotate(381deg) translate3d(860px, 137px, 1000px) scale(1);
    }
}

.tri:nth-child(121) {
    border-top: 46px solid #0080ff;
    border-right: 46px solid transparent;
    border-left: 46px solid transparent;
    margin-left: -23px;
    margin-top: -23px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(269deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim121 10s infinite linear;
    animation-delay: -6.05s;
    opacity: 0;
}

@keyframes anim121 {
    0% {
        opacity: 1;
        transform: rotate(403.5deg) translate3d(856px, 338px, 1000px) scale(1);
    }
}

.tri:nth-child(122) {
    border-top: 24px solid #ff00c4;
    border-right: 24px solid transparent;
    border-left: 24px solid transparent;
    margin-left: -12px;
    margin-top: -12px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(278deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim122 10s infinite linear;
    animation-delay: -6.1s;
    opacity: 0;
}

@keyframes anim122 {
    0% {
        opacity: 1;
        transform: rotate(417deg) translate3d(992px, 758px, 1000px) scale(1);
    }
}

.tri:nth-child(123) {
    border-top: 49px solid #ff0088;
    border-right: 49px solid transparent;
    border-left: 49px solid transparent;
    margin-left: -24.5px;
    margin-top: -24.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(13deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim123 10s infinite linear;
    animation-delay: -6.15s;
    opacity: 0;
}

@keyframes anim123 {
    0% {
        opacity: 1;
        transform: rotate(19.5deg) translate3d(820px, 346px, 1000px) scale(1);
    }
}

.tri:nth-child(124) {
    border-top: 36px solid #8cff00;
    border-right: 36px solid transparent;
    border-left: 36px solid transparent;
    margin-left: -18px;
    margin-top: -18px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(52deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim124 10s infinite linear;
    animation-delay: -6.2s;
    opacity: 0;
}

@keyframes anim124 {
    0% {
        opacity: 1;
        transform: rotate(78deg) translate3d(256px, 475px, 1000px) scale(1);
    }
}

.tri:nth-child(125) {
    border-top: 13px solid #ffe600;
    border-right: 13px solid transparent;
    border-left: 13px solid transparent;
    margin-left: -6.5px;
    margin-top: -6.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(273deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim125 10s infinite linear;
    animation-delay: -6.25s;
    opacity: 0;
}

@keyframes anim125 {
    0% {
        opacity: 1;
        transform: rotate(409.5deg) translate3d(163px, 386px, 1000px) scale(1);
    }
}

.tri:nth-child(126) {
    border-top: 46px solid #00ff0d;
    border-right: 46px solid transparent;
    border-left: 46px solid transparent;
    margin-left: -23px;
    margin-top: -23px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(66deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim126 10s infinite linear;
    animation-delay: -6.3s;
    opacity: 0;
}

@keyframes anim126 {
    0% {
        opacity: 1;
        transform: rotate(99deg) translate3d(114px, 463px, 1000px) scale(1);
    }
}

.tri:nth-child(127) {
    border-top: 34px solid #0080ff;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(107deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim127 10s infinite linear;
    animation-delay: -6.35s;
    opacity: 0;
}

@keyframes anim127 {
    0% {
        opacity: 1;
        transform: rotate(160.5deg) translate3d(78px, 687px, 1000px) scale(1);
    }
}

.tri:nth-child(128) {
    border-top: 16px solid #ffc400;
    border-right: 16px solid transparent;
    border-left: 16px solid transparent;
    margin-left: -8px;
    margin-top: -8px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(203deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim128 10s infinite linear;
    animation-delay: -6.4s;
    opacity: 0;
}

@keyframes anim128 {
    0% {
        opacity: 1;
        transform: rotate(304.5deg) translate3d(664px, 584px, 1000px) scale(1);
    }
}

.tri:nth-child(129) {
    border-top: 30px solid #002bff;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(297deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim129 10s infinite linear;
    animation-delay: -6.45s;
    opacity: 0;
}

@keyframes anim129 {
    0% {
        opacity: 1;
        transform: rotate(445.5deg) translate3d(632px, 392px, 1000px) scale(1);
    }
}

.tri:nth-child(130) {
    border-top: 20px solid #00ff73;
    border-right: 20px solid transparent;
    border-left: 20px solid transparent;
    margin-left: -10px;
    margin-top: -10px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(137deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim130 10s infinite linear;
    animation-delay: -6.5s;
    opacity: 0;
}

@keyframes anim130 {
    0% {
        opacity: 1;
        transform: rotate(205.5deg) translate3d(411px, 968px, 1000px) scale(1);
    }
}

.tri:nth-child(131) {
    border-top: 15px solid #22ff00;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    margin-left: -7.5px;
    margin-top: -7.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(61deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim131 10s infinite linear;
    animation-delay: -6.55s;
    opacity: 0;
}

@keyframes anim131 {
    0% {
        opacity: 1;
        transform: rotate(91.5deg) translate3d(414px, 653px, 1000px) scale(1);
    }
}

.tri:nth-child(132) {
    border-top: 9px solid #ff5e00;
    border-right: 9px solid transparent;
    border-left: 9px solid transparent;
    margin-left: -4.5px;
    margin-top: -4.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(101deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim132 10s infinite linear;
    animation-delay: -6.6s;
    opacity: 0;
}

@keyframes anim132 {
    0% {
        opacity: 1;
        transform: rotate(151.5deg) translate3d(510px, 323px, 1000px) scale(1);
    }
}

.tri:nth-child(133) {
    border-top: 11px solid #00ffd0;
    border-right: 11px solid transparent;
    border-left: 11px solid transparent;
    margin-left: -5.5px;
    margin-top: -5.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(145deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim133 10s infinite linear;
    animation-delay: -6.65s;
    opacity: 0;
}

@keyframes anim133 {
    0% {
        opacity: 1;
        transform: rotate(217.5deg) translate3d(213px, 986px, 1000px) scale(1);
    }
}

.tri:nth-child(134) {
    border-top: 1px solid #ff0040;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(183deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim134 10s infinite linear;
    animation-delay: -6.7s;
    opacity: 0;
}

@keyframes anim134 {
    0% {
        opacity: 1;
        transform: rotate(274.5deg) translate3d(376px, 877px, 1000px) scale(1);
    }
}

.tri:nth-child(135) {
    border-top: 1px solid #ff9100;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(76deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim135 10s infinite linear;
    animation-delay: -6.75s;
    opacity: 0;
}

@keyframes anim135 {
    0% {
        opacity: 1;
        transform: rotate(114deg) translate3d(391px, 77px, 1000px) scale(1);
    }
}

.tri:nth-child(136) {
    border-top: 47px solid #51ff00;
    border-right: 47px solid transparent;
    border-left: 47px solid transparent;
    margin-left: -23.5px;
    margin-top: -23.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(152deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim136 10s infinite linear;
    animation-delay: -6.8s;
    opacity: 0;
}

@keyframes anim136 {
    0% {
        opacity: 1;
        transform: rotate(228deg) translate3d(83px, 399px, 1000px) scale(1);
    }
}

.tri:nth-child(137) {
    border-top: 3px solid #00e1ff;
    border-right: 3px solid transparent;
    border-left: 3px solid transparent;
    margin-left: -1.5px;
    margin-top: -1.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(46deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim137 10s infinite linear;
    animation-delay: -6.85s;
    opacity: 0;
}

@keyframes anim137 {
    0% {
        opacity: 1;
        transform: rotate(69deg) translate3d(102px, 9px, 1000px) scale(1);
    }
}

.tri:nth-child(138) {
    border-top: 45px solid #0084ff;
    border-right: 45px solid transparent;
    border-left: 45px solid transparent;
    margin-left: -22.5px;
    margin-top: -22.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(226deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim138 10s infinite linear;
    animation-delay: -6.9s;
    opacity: 0;
}

@keyframes anim138 {
    0% {
        opacity: 1;
        transform: rotate(339deg) translate3d(905px, 717px, 1000px) scale(1);
    }
}

.tri:nth-child(139) {
    border-top: 39px solid #ff5100;
    border-right: 39px solid transparent;
    border-left: 39px solid transparent;
    margin-left: -19.5px;
    margin-top: -19.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(46deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim139 10s infinite linear;
    animation-delay: -6.95s;
    opacity: 0;
}

@keyframes anim139 {
    0% {
        opacity: 1;
        transform: rotate(69deg) translate3d(752px, 521px, 1000px) scale(1);
    }
}

.tri:nth-child(140) {
    border-top: 19px solid #00ffaa;
    border-right: 19px solid transparent;
    border-left: 19px solid transparent;
    margin-left: -9.5px;
    margin-top: -9.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(61deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim140 10s infinite linear;
    animation-delay: -7s;
    opacity: 0;
}

@keyframes anim140 {
    0% {
        opacity: 1;
        transform: rotate(91.5deg) translate3d(142px, 783px, 1000px) scale(1);
    }
}

.tri:nth-child(141) {
    border-top: 46px solid #ff00dd;
    border-right: 46px solid transparent;
    border-left: 46px solid transparent;
    margin-left: -23px;
    margin-top: -23px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(296deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim141 10s infinite linear;
    animation-delay: -7.05s;
    opacity: 0;
}

@keyframes anim141 {
    0% {
        opacity: 1;
        transform: rotate(444deg) translate3d(183px, 752px, 1000px) scale(1);
    }
}

.tri:nth-child(142) {
    border-top: 46px solid #f2ff00;
    border-right: 46px solid transparent;
    border-left: 46px solid transparent;
    margin-left: -23px;
    margin-top: -23px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(12deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim142 10s infinite linear;
    animation-delay: -7.1s;
    opacity: 0;
}

@keyframes anim142 {
    0% {
        opacity: 1;
        transform: rotate(18deg) translate3d(292px, 592px, 1000px) scale(1);
    }
}

.tri:nth-child(143) {
    border-top: 16px solid #001aff;
    border-right: 16px solid transparent;
    border-left: 16px solid transparent;
    margin-left: -8px;
    margin-top: -8px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(21deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim143 10s infinite linear;
    animation-delay: -7.15s;
    opacity: 0;
}

@keyframes anim143 {
    0% {
        opacity: 1;
        transform: rotate(31.5deg) translate3d(216px, 777px, 1000px) scale(1);
    }
}

.tri:nth-child(144) {
    border-top: 17px solid #009dff;
    border-right: 17px solid transparent;
    border-left: 17px solid transparent;
    margin-left: -8.5px;
    margin-top: -8.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(149deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim144 10s infinite linear;
    animation-delay: -7.2s;
    opacity: 0;
}

@keyframes anim144 {
    0% {
        opacity: 1;
        transform: rotate(223.5deg) translate3d(408px, 397px, 1000px) scale(1);
    }
}

.tri:nth-child(145) {
    border-top: 30px solid #a6ff00;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(334deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim145 10s infinite linear;
    animation-delay: -7.25s;
    opacity: 0;
}

@keyframes anim145 {
    0% {
        opacity: 1;
        transform: rotate(501deg) translate3d(747px, 81px, 1000px) scale(1);
    }
}

.tri:nth-child(146) {
    border-top: 27px solid #0d00ff;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(210deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim146 10s infinite linear;
    animation-delay: -7.3s;
    opacity: 0;
}

@keyframes anim146 {
    0% {
        opacity: 1;
        transform: rotate(315deg) translate3d(310px, 284px, 1000px) scale(1);
    }
}

.tri:nth-child(147) {
    border-top: 44px solid #ff0026;
    border-right: 44px solid transparent;
    border-left: 44px solid transparent;
    margin-left: -22px;
    margin-top: -22px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(295deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim147 10s infinite linear;
    animation-delay: -7.35s;
    opacity: 0;
}

@keyframes anim147 {
    0% {
        opacity: 1;
        transform: rotate(442.5deg) translate3d(318px, 92px, 1000px) scale(1);
    }
}

.tri:nth-child(148) {
    border-top: 34px solid #62ff00;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(90deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim148 10s infinite linear;
    animation-delay: -7.4s;
    opacity: 0;
}

@keyframes anim148 {
    0% {
        opacity: 1;
        transform: rotate(135deg) translate3d(176px, 494px, 1000px) scale(1);
    }
}

.tri:nth-child(149) {
    border-top: 1px solid #ff0073;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(207deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim149 10s infinite linear;
    animation-delay: -7.45s;
    opacity: 0;
}

@keyframes anim149 {
    0% {
        opacity: 1;
        transform: rotate(310.5deg) translate3d(679px, 245px, 1000px) scale(1);
    }
}

.tri:nth-child(150) {
    border-top: 23px solid #ffa600;
    border-right: 23px solid transparent;
    border-left: 23px solid transparent;
    margin-left: -11.5px;
    margin-top: -11.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(201deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim150 10s infinite linear;
    animation-delay: -7.5s;
    opacity: 0;
}

@keyframes anim150 {
    0% {
        opacity: 1;
        transform: rotate(301.5deg) translate3d(704px, 198px, 1000px) scale(1);
    }
}

.tri:nth-child(151) {
    border-top: 7px solid #2200ff;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    margin-left: -3.5px;
    margin-top: -3.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(105deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim151 10s infinite linear;
    animation-delay: -7.55s;
    opacity: 0;
}

@keyframes anim151 {
    0% {
        opacity: 1;
        transform: rotate(157.5deg) translate3d(183px, 630px, 1000px) scale(1);
    }
}

.tri:nth-child(152) {
    border-top: 10px solid #b300ff;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    margin-left: -5px;
    margin-top: -5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(216deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim152 10s infinite linear;
    animation-delay: -7.6s;
    opacity: 0;
}

@keyframes anim152 {
    0% {
        opacity: 1;
        transform: rotate(324deg) translate3d(243px, 36px, 1000px) scale(1);
    }
}

.tri:nth-child(153) {
    border-top: 1px solid #ff0004;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(330deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim153 10s infinite linear;
    animation-delay: -7.65s;
    opacity: 0;
}

@keyframes anim153 {
    0% {
        opacity: 1;
        transform: rotate(495deg) translate3d(427px, 318px, 1000px) scale(1);
    }
}

.tri:nth-child(154) {
    border-top: 36px solid #ff0095;
    border-right: 36px solid transparent;
    border-left: 36px solid transparent;
    margin-left: -18px;
    margin-top: -18px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(275deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim154 10s infinite linear;
    animation-delay: -7.7s;
    opacity: 0;
}

@keyframes anim154 {
    0% {
        opacity: 1;
        transform: rotate(412.5deg) translate3d(636px, 12px, 1000px) scale(1);
    }
}

.tri:nth-child(155) {
    border-top: 45px solid #ff00ae;
    border-right: 45px solid transparent;
    border-left: 45px solid transparent;
    margin-left: -22.5px;
    margin-top: -22.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(100deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim155 10s infinite linear;
    animation-delay: -7.75s;
    opacity: 0;
}

@keyframes anim155 {
    0% {
        opacity: 1;
        transform: rotate(150deg) translate3d(57px, 572px, 1000px) scale(1);
    }
}

.tri:nth-child(156) {
    border-top: 28px solid #0037ff;
    border-right: 28px solid transparent;
    border-left: 28px solid transparent;
    margin-left: -14px;
    margin-top: -14px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(185deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim156 10s infinite linear;
    animation-delay: -7.8s;
    opacity: 0;
}

@keyframes anim156 {
    0% {
        opacity: 1;
        transform: rotate(277.5deg) translate3d(875px, 421px, 1000px) scale(1);
    }
}

.tri:nth-child(157) {
    border-top: 19px solid #001aff;
    border-right: 19px solid transparent;
    border-left: 19px solid transparent;
    margin-left: -9.5px;
    margin-top: -9.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(114deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim157 10s infinite linear;
    animation-delay: -7.85s;
    opacity: 0;
}

@keyframes anim157 {
    0% {
        opacity: 1;
        transform: rotate(171deg) translate3d(954px, 633px, 1000px) scale(1);
    }
}

.tri:nth-child(158) {
    border-top: 43px solid #2b00ff;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    margin-left: -21.5px;
    margin-top: -21.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(146deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim158 10s infinite linear;
    animation-delay: -7.9s;
    opacity: 0;
}

@keyframes anim158 {
    0% {
        opacity: 1;
        transform: rotate(219deg) translate3d(263px, 410px, 1000px) scale(1);
    }
}

.tri:nth-child(159) {
    border-top: 27px solid #00ffd5;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(108deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim159 10s infinite linear;
    animation-delay: -7.95s;
    opacity: 0;
}

@keyframes anim159 {
    0% {
        opacity: 1;
        transform: rotate(162deg) translate3d(580px, 859px, 1000px) scale(1);
    }
}

.tri:nth-child(160) {
    border-top: 10px solid #ff0011;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    margin-left: -5px;
    margin-top: -5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(31deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim160 10s infinite linear;
    animation-delay: -8s;
    opacity: 0;
}

@keyframes anim160 {
    0% {
        opacity: 1;
        transform: rotate(46.5deg) translate3d(394px, 453px, 1000px) scale(1);
    }
}

.tri:nth-child(161) {
    border-top: 16px solid #00ffa2;
    border-right: 16px solid transparent;
    border-left: 16px solid transparent;
    margin-left: -8px;
    margin-top: -8px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(334deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim161 10s infinite linear;
    animation-delay: -8.05s;
    opacity: 0;
}

@keyframes anim161 {
    0% {
        opacity: 1;
        transform: rotate(501deg) translate3d(737px, 714px, 1000px) scale(1);
    }
}

.tri:nth-child(162) {
    border-top: 50px solid #00f7ff;
    border-right: 50px solid transparent;
    border-left: 50px solid transparent;
    margin-left: -25px;
    margin-top: -25px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(133deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim162 10s infinite linear;
    animation-delay: -8.1s;
    opacity: 0;
}

@keyframes anim162 {
    0% {
        opacity: 1;
        transform: rotate(199.5deg) translate3d(413px, 176px, 1000px) scale(1);
    }
}

.tri:nth-child(163) {
    border-top: 6px solid #fff700;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    margin-left: -3px;
    margin-top: -3px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(75deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim163 10s infinite linear;
    animation-delay: -8.15s;
    opacity: 0;
}

@keyframes anim163 {
    0% {
        opacity: 1;
        transform: rotate(112.5deg) translate3d(668px, 341px, 1000px) scale(1);
    }
}

.tri:nth-child(164) {
    border-top: 39px solid #ff0037;
    border-right: 39px solid transparent;
    border-left: 39px solid transparent;
    margin-left: -19.5px;
    margin-top: -19.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(324deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim164 10s infinite linear;
    animation-delay: -8.2s;
    opacity: 0;
}

@keyframes anim164 {
    0% {
        opacity: 1;
        transform: rotate(486deg) translate3d(945px, 174px, 1000px) scale(1);
    }
}

.tri:nth-child(165) {
    border-top: 50px solid #00ff3c;
    border-right: 50px solid transparent;
    border-left: 50px solid transparent;
    margin-left: -25px;
    margin-top: -25px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(59deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim165 10s infinite linear;
    animation-delay: -8.25s;
    opacity: 0;
}

@keyframes anim165 {
    0% {
        opacity: 1;
        transform: rotate(88.5deg) translate3d(340px, 713px, 1000px) scale(1);
    }
}

.tri:nth-child(166) {
    border-top: 2px solid #f7ff00;
    border-right: 2px solid transparent;
    border-left: 2px solid transparent;
    margin-left: -1px;
    margin-top: -1px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(354deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim166 10s infinite linear;
    animation-delay: -8.3s;
    opacity: 0;
}

@keyframes anim166 {
    0% {
        opacity: 1;
        transform: rotate(531deg) translate3d(820px, 764px, 1000px) scale(1);
    }
}

.tri:nth-child(167) {
    border-top: 13px solid #00ff44;
    border-right: 13px solid transparent;
    border-left: 13px solid transparent;
    margin-left: -6.5px;
    margin-top: -6.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(204deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim167 10s infinite linear;
    animation-delay: -8.35s;
    opacity: 0;
}

@keyframes anim167 {
    0% {
        opacity: 1;
        transform: rotate(306deg) translate3d(839px, 536px, 1000px) scale(1);
    }
}

.tri:nth-child(168) {
    border-top: 14px solid #ff003c;
    border-right: 14px solid transparent;
    border-left: 14px solid transparent;
    margin-left: -7px;
    margin-top: -7px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(57deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim168 10s infinite linear;
    animation-delay: -8.4s;
    opacity: 0;
}

@keyframes anim168 {
    0% {
        opacity: 1;
        transform: rotate(85.5deg) translate3d(860px, 948px, 1000px) scale(1);
    }
}

.tri:nth-child(169) {
    border-top: 34px solid #0900ff;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(215deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim169 10s infinite linear;
    animation-delay: -8.45s;
    opacity: 0;
}

@keyframes anim169 {
    0% {
        opacity: 1;
        transform: rotate(322.5deg) translate3d(876px, 812px, 1000px) scale(1);
    }
}

.tri:nth-child(170) {
    border-top: 40px solid #00ffbf;
    border-right: 40px solid transparent;
    border-left: 40px solid transparent;
    margin-left: -20px;
    margin-top: -20px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(75deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim170 10s infinite linear;
    animation-delay: -8.5s;
    opacity: 0;
}

@keyframes anim170 {
    0% {
        opacity: 1;
        transform: rotate(112.5deg) translate3d(597px, 763px, 1000px) scale(1);
    }
}

.tri:nth-child(171) {
    border-top: 48px solid #ff0033;
    border-right: 48px solid transparent;
    border-left: 48px solid transparent;
    margin-left: -24px;
    margin-top: -24px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(231deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim171 10s infinite linear;
    animation-delay: -8.55s;
    opacity: 0;
}

@keyframes anim171 {
    0% {
        opacity: 1;
        transform: rotate(346.5deg) translate3d(936px, 789px, 1000px) scale(1);
    }
}

.tri:nth-child(172) {
    border-top: 25px solid #22ff00;
    border-right: 25px solid transparent;
    border-left: 25px solid transparent;
    margin-left: -12.5px;
    margin-top: -12.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(185deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim172 10s infinite linear;
    animation-delay: -8.6s;
    opacity: 0;
}

@keyframes anim172 {
    0% {
        opacity: 1;
        transform: rotate(277.5deg) translate3d(278px, 755px, 1000px) scale(1);
    }
}

.tri:nth-child(173) {
    border-top: 16px solid #c400ff;
    border-right: 16px solid transparent;
    border-left: 16px solid transparent;
    margin-left: -8px;
    margin-top: -8px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(130deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim173 10s infinite linear;
    animation-delay: -8.65s;
    opacity: 0;
}

@keyframes anim173 {
    0% {
        opacity: 1;
        transform: rotate(195deg) translate3d(186px, 128px, 1000px) scale(1);
    }
}

.tri:nth-child(174) {
    border-top: 16px solid #d0ff00;
    border-right: 16px solid transparent;
    border-left: 16px solid transparent;
    margin-left: -8px;
    margin-top: -8px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(230deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim174 10s infinite linear;
    animation-delay: -8.7s;
    opacity: 0;
}

@keyframes anim174 {
    0% {
        opacity: 1;
        transform: rotate(345deg) translate3d(963px, 293px, 1000px) scale(1);
    }
}

.tri:nth-child(175) {
    border-top: 13px solid #ff0900;
    border-right: 13px solid transparent;
    border-left: 13px solid transparent;
    margin-left: -6.5px;
    margin-top: -6.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(306deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim175 10s infinite linear;
    animation-delay: -8.75s;
    opacity: 0;
}

@keyframes anim175 {
    0% {
        opacity: 1;
        transform: rotate(459deg) translate3d(480px, 112px, 1000px) scale(1);
    }
}

.tri:nth-child(176) {
    border-top: 49px solid #ff0055;
    border-right: 49px solid transparent;
    border-left: 49px solid transparent;
    margin-left: -24.5px;
    margin-top: -24.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(330deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim176 10s infinite linear;
    animation-delay: -8.8s;
    opacity: 0;
}

@keyframes anim176 {
    0% {
        opacity: 1;
        transform: rotate(495deg) translate3d(82px, 150px, 1000px) scale(1);
    }
}

.tri:nth-child(177) {
    border-top: 17px solid #a200ff;
    border-right: 17px solid transparent;
    border-left: 17px solid transparent;
    margin-left: -8.5px;
    margin-top: -8.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(130deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim177 10s infinite linear;
    animation-delay: -8.85s;
    opacity: 0;
}

@keyframes anim177 {
    0% {
        opacity: 1;
        transform: rotate(195deg) translate3d(388px, 248px, 1000px) scale(1);
    }
}

.tri:nth-child(178) {
    border-top: 45px solid #ffaa00;
    border-right: 45px solid transparent;
    border-left: 45px solid transparent;
    margin-left: -22.5px;
    margin-top: -22.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(293deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim178 10s infinite linear;
    animation-delay: -8.9s;
    opacity: 0;
}

@keyframes anim178 {
    0% {
        opacity: 1;
        transform: rotate(439.5deg) translate3d(603px, 709px, 1000px) scale(1);
    }
}

.tri:nth-child(179) {
    border-top: 1px solid #ff00aa;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(98deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim179 10s infinite linear;
    animation-delay: -8.95s;
    opacity: 0;
}

@keyframes anim179 {
    0% {
        opacity: 1;
        transform: rotate(147deg) translate3d(623px, 397px, 1000px) scale(1);
    }
}

.tri:nth-child(180) {
    border-top: 1px solid #0d00ff;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(263deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim180 10s infinite linear;
    animation-delay: -9s;
    opacity: 0;
}

@keyframes anim180 {
    0% {
        opacity: 1;
        transform: rotate(394.5deg) translate3d(256px, 308px, 1000px) scale(1);
    }
}

.tri:nth-child(181) {
    border-top: 29px solid #1e00ff;
    border-right: 29px solid transparent;
    border-left: 29px solid transparent;
    margin-left: -14.5px;
    margin-top: -14.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(214deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim181 10s infinite linear;
    animation-delay: -9.05s;
    opacity: 0;
}

@keyframes anim181 {
    0% {
        opacity: 1;
        transform: rotate(321deg) translate3d(455px, 705px, 1000px) scale(1);
    }
}

.tri:nth-child(182) {
    border-top: 34px solid #00ffe1;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(251deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim182 10s infinite linear;
    animation-delay: -9.1s;
    opacity: 0;
}

@keyframes anim182 {
    0% {
        opacity: 1;
        transform: rotate(376.5deg) translate3d(657px, 751px, 1000px) scale(1);
    }
}

.tri:nth-child(183) {
    border-top: 31px solid #00e6ff;
    border-right: 31px solid transparent;
    border-left: 31px solid transparent;
    margin-left: -15.5px;
    margin-top: -15.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(56deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim183 10s infinite linear;
    animation-delay: -9.15s;
    opacity: 0;
}

@keyframes anim183 {
    0% {
        opacity: 1;
        transform: rotate(84deg) translate3d(450px, 224px, 1000px) scale(1);
    }
}

.tri:nth-child(184) {
    border-top: 37px solid #ff3300;
    border-right: 37px solid transparent;
    border-left: 37px solid transparent;
    margin-left: -18.5px;
    margin-top: -18.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(313deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim184 10s infinite linear;
    animation-delay: -9.2s;
    opacity: 0;
}

@keyframes anim184 {
    0% {
        opacity: 1;
        transform: rotate(469.5deg) translate3d(862px, 100px, 1000px) scale(1);
    }
}

.tri:nth-child(185) {
    border-top: 27px solid #00ff84;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(128deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim185 10s infinite linear;
    animation-delay: -9.25s;
    opacity: 0;
}

@keyframes anim185 {
    0% {
        opacity: 1;
        transform: rotate(192deg) translate3d(922px, 658px, 1000px) scale(1);
    }
}

.tri:nth-child(186) {
    border-top: 6px solid #00ff26;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    margin-left: -3px;
    margin-top: -3px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(49deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim186 10s infinite linear;
    animation-delay: -9.3s;
    opacity: 0;
}

@keyframes anim186 {
    0% {
        opacity: 1;
        transform: rotate(73.5deg) translate3d(610px, 238px, 1000px) scale(1);
    }
}

.tri:nth-child(187) {
    border-top: 25px solid #00ff88;
    border-right: 25px solid transparent;
    border-left: 25px solid transparent;
    margin-left: -12.5px;
    margin-top: -12.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(273deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim187 10s infinite linear;
    animation-delay: -9.35s;
    opacity: 0;
}

@keyframes anim187 {
    0% {
        opacity: 1;
        transform: rotate(409.5deg) translate3d(552px, 256px, 1000px) scale(1);
    }
}

.tri:nth-child(188) {
    border-top: 24px solid #dd00ff;
    border-right: 24px solid transparent;
    border-left: 24px solid transparent;
    margin-left: -12px;
    margin-top: -12px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(296deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim188 10s infinite linear;
    animation-delay: -9.4s;
    opacity: 0;
}

@keyframes anim188 {
    0% {
        opacity: 1;
        transform: rotate(444deg) translate3d(497px, 465px, 1000px) scale(1);
    }
}

.tri:nth-child(189) {
    border-top: 15px solid #ffa200;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    margin-left: -7.5px;
    margin-top: -7.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(75deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim189 10s infinite linear;
    animation-delay: -9.45s;
    opacity: 0;
}

@keyframes anim189 {
    0% {
        opacity: 1;
        transform: rotate(112.5deg) translate3d(278px, 192px, 1000px) scale(1);
    }
}

.tri:nth-child(190) {
    border-top: 13px solid #ff1500;
    border-right: 13px solid transparent;
    border-left: 13px solid transparent;
    margin-left: -6.5px;
    margin-top: -6.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(15deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim190 10s infinite linear;
    animation-delay: -9.5s;
    opacity: 0;
}

@keyframes anim190 {
    0% {
        opacity: 1;
        transform: rotate(22.5deg) translate3d(1000px, 469px, 1000px) scale(1);
    }
}

.tri:nth-child(191) {
    border-top: 8px solid #f7ff00;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    margin-left: -4px;
    margin-top: -4px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(239deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim191 10s infinite linear;
    animation-delay: -9.55s;
    opacity: 0;
}

@keyframes anim191 {
    0% {
        opacity: 1;
        transform: rotate(358.5deg) translate3d(664px, 898px, 1000px) scale(1);
    }
}

.tri:nth-child(192) {
    border-top: 1px solid #00e6ff;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    margin-left: -0.5px;
    margin-top: -0.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(352deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim192 10s infinite linear;
    animation-delay: -9.6s;
    opacity: 0;
}

@keyframes anim192 {
    0% {
        opacity: 1;
        transform: rotate(528deg) translate3d(551px, 657px, 1000px) scale(1);
    }
}

.tri:nth-child(193) {
    border-top: 38px solid #c8ff00;
    border-right: 38px solid transparent;
    border-left: 38px solid transparent;
    margin-left: -19px;
    margin-top: -19px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(97deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim193 10s infinite linear;
    animation-delay: -9.65s;
    opacity: 0;
}

@keyframes anim193 {
    0% {
        opacity: 1;
        transform: rotate(145.5deg) translate3d(217px, 355px, 1000px) scale(1);
    }
}

.tri:nth-child(194) {
    border-top: 27px solid #00ff88;
    border-right: 27px solid transparent;
    border-left: 27px solid transparent;
    margin-left: -13.5px;
    margin-top: -13.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(348deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim194 10s infinite linear;
    animation-delay: -9.7s;
    opacity: 0;
}

@keyframes anim194 {
    0% {
        opacity: 1;
        transform: rotate(522deg) translate3d(164px, 624px, 1000px) scale(1);
    }
}

.tri:nth-child(195) {
    border-top: 30px solid #ff6f00;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    margin-left: -15px;
    margin-top: -15px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(218deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim195 10s infinite linear;
    animation-delay: -9.75s;
    opacity: 0;
}

@keyframes anim195 {
    0% {
        opacity: 1;
        transform: rotate(327deg) translate3d(746px, 749px, 1000px) scale(1);
    }
}

.tri:nth-child(196) {
    border-top: 50px solid #6600ff;
    border-right: 50px solid transparent;
    border-left: 50px solid transparent;
    margin-left: -25px;
    margin-top: -25px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(284deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim196 10s infinite linear;
    animation-delay: -9.8s;
    opacity: 0;
}

@keyframes anim196 {
    0% {
        opacity: 1;
        transform: rotate(426deg) translate3d(477px, 887px, 1000px) scale(1);
    }
}

.tri:nth-child(197) {
    border-top: 9px solid #00ff11;
    border-right: 9px solid transparent;
    border-left: 9px solid transparent;
    margin-left: -4.5px;
    margin-top: -4.5px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(216deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim197 10s infinite linear;
    animation-delay: -9.85s;
    opacity: 0;
}

@keyframes anim197 {
    0% {
        opacity: 1;
        transform: rotate(324deg) translate3d(213px, 479px, 1000px) scale(1);
    }
}

.tri:nth-child(198) {
    border-top: 38px solid red;
    border-right: 38px solid transparent;
    border-left: 38px solid transparent;
    margin-left: -19px;
    margin-top: -19px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(102deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim198 10s infinite linear;
    animation-delay: -9.9s;
    opacity: 0;
}

@keyframes anim198 {
    0% {
        opacity: 1;
        transform: rotate(153deg) translate3d(665px, 268px, 1000px) scale(1);
    }
}

.tri:nth-child(199) {
    border-top: 34px solid #ff00ae;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(77deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim199 10s infinite linear;
    animation-delay: -9.95s;
    opacity: 0;
}

@keyframes anim199 {
    0% {
        opacity: 1;
        transform: rotate(115.5deg) translate3d(168px, 862px, 1000px) scale(1);
    }
}

.tri:nth-child(200) {
    border-top: 34px solid #00ff26;
    border-right: 34px solid transparent;
    border-left: 34px solid transparent;
    margin-left: -17px;
    margin-top: -17px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transform: rotate(326deg) translate3d(0, 0, -1500px) scale(0);
    animation: anim200 10s infinite linear;
    animation-delay: -10s;
    opacity: 0;
}

@keyframes anim200 {
    0% {
        opacity: 1;
        transform: rotate(489deg) translate3d(590px, 113px, 1000px) scale(1);
    }
}`