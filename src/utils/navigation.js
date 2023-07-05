const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition);
};

const fetchpage = async (url) => {
  // load destine page
  // use fetch or something for get the html
  const response = await fetch(url) // /clean-code
  const text = await response.text()
  // keep only with the content of the html inside the body tag
  // using a regex to get it
  const [, data] = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return data;
};

export const startViewTransition = () => {
  
  if (!checkIsNavigationSupported()) return;
    window.navigation.addEventListener('navigate', (event) => {
    const toUrl = new URL(event.destination.url)

    // is an external link
    if (toUrl.origin !== window.location.origin) return;

    // is a navigation a same domain
    event.intercept({
      async handler () {
        const page = await fetchpage(toUrl.pathname)
        // use startviewtransition to start the transition
        document.startViewTransition((() => {
          // how it have that update the dom with the new content
          // document.getElementById('content').innerHTML = data
          document.body.innerHTML = page
          // scroll to top of the page
          document.documentElement.scrollTop = 0
        }))
      }
    })
  })

}