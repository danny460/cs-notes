window.addEventListener('load', function(){
  var article = document.getElementsByTagName('article')[0];
  var onPageNav = document.getElementsByClassName('onPageNav')[0];
  
  if(article && onPageNav.hasChildNodes()) {
    var headings = article.querySelectorAll('h2, h3');
    var tocLinks = onPageNav.getElementsByTagName('a');

    var mappingArr = Array.prototype.map.call(headings, function(heading, index) {
      var anchor = heading.getElementsByClassName('anchor')[0];
      return { anchor: anchor, navLink: tocLinks[index] };
    });

    var navLinks = mappingArr.map(function(m){
      return m.navLink;
    });

    window.addEventListener('scroll', function() {
      var scrollHeight = window.scrollY;
      
      var passed = mappingArr.filter(function(mapping) {
        var anchorHeight = mapping.anchor.offsetTop;//mapping.anchor.getBoundingClientRect().top;
        return scrollHeight > anchorHeight;
      });

      var lastPassed = passed[passed.length - 1] || {};
      navLinks.forEach(function(navLink) {
        if(navLink === lastPassed.navLink) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      });
    });
  }
});