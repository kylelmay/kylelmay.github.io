// Modal function for certifications
var APlus = {
  apluspdf: {
    openAPlus:  function() { document.getElementById('APlus').classList.add('is-active');},
    closeAPlus: function() { document.getElementById('APlus').classList.remove('is-active');}
  }
};

var linuxPro = {
  linuxpdf: {
    openLinuxPro:  function() { document.getElementById('linuxPro').classList.add('is-active');},
    closeLinuxPro: function() { document.getElementById('linuxPro').classList.remove('is-active');}
  }
};

// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {
    var burger = document.querySelector('.burger');
    var menu = document.querySelector('#'+burger.dataset.target);
    burger.addEventListener('click', function() {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
})();
