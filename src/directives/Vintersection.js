export default {
    mounted(el, binding) {
        const {rootElem, callback} = binding.value;

         const options = {
             root: document.querySelector(rootElem),
             rootMargin: '0px',
             threshold: 1.0,
         };

         const observerCallback = function(entries, observer) {
             if (entries[0].isIntersecting) {
                 callback();
             }
         };

         const observer = new IntersectionObserver(observerCallback, options);
         observer.observe(el);
    }
    ,
    name:'intersection'
}