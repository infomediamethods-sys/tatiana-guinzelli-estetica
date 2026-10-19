/* movimento.js — movimento DESTE site, reproduzido de atouchofsass.com.au (Kit de Design, seção "Movimento";
   specs/design.md §10). A referência não anima entradas nem tem efeito ligado à rolagem: o movimento dela está nos
   hovers de 0,18 s (CSS), no cabeçalho que vira faixa creme ao rolar (main.js põe [data-rolado]) e no item de
   navegação com sublinhado terracota no ativo. Este arquivo marca o item ativo da navegação conforme a seção à vista.
   main.js e base.css não se editam. Com prefers-reduced-motion o sublinhado ainda acompanha (é estado, não animação). */
(function () {
  'use strict';
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var porId = {};
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var secao = document.getElementById(id);
    if (secao) porId[id] = { link: a, secao: secao };
  });

  var visiveis = {};
  function marcar() {
    var ativo = null, melhor = 0;
    Object.keys(visiveis).forEach(function (id) {
      if (visiveis[id] > melhor) { melhor = visiveis[id]; ativo = id; }
    });
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (ativo && porId[ativo]) porId[ativo].link.setAttribute('aria-current', 'true');
  }

  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      var id = en.target.id;
      if (en.isIntersecting) visiveis[id] = en.intersectionRatio; else delete visiveis[id];
    });
    marcar();
  }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

  Object.keys(porId).forEach(function (id) { obs.observe(porId[id].secao); });
})();
