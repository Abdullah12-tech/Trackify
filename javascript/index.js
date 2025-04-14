document.addEventListener('DOMContentLoaded', function() {
    // open
    const burger = document.querySelectorAll('.navbar-burger');
    const menu = document.querySelectorAll('.navbar-menu');

    if (burger.length && menu.length) {
        for (var i = 0; i < burger.length; i++) {
            burger[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    // close
    const close = document.querySelectorAll('.navbar-close');
    const backdrop = document.querySelectorAll('.navbar-backdrop');

    if (close.length) {
        for (var i = 0; i < close.length; i++) {
            close[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    if (backdrop.length) {
        for (var i = 0; i < backdrop.length; i++) {
            backdrop[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }
});



function scrollHandler(element = null) {
    return {
      height: 0,
      element: element,
      calculateHeight(position) {
        const distanceFromTop = this.element.offsetTop
        const contentHeight = this.element.clientHeight
        const visibleContent = contentHeight - window.innerHeight
        const start = Math.max(0, position - distanceFromTop)
        const percent = (start / visibleContent) * 100;
        requestAnimationFrame(() => {
          this.height = percent;
        });
      },
      init() {
        this.element = this.element || document.body;
        this.calculateHeight(window.scrollY);
      }
    };
  }