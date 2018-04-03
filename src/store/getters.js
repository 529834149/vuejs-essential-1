export default {
  getArticleById: (state) => (id) => {
    let articles = state.articles

    if (Array.isArray(articles)) {
      articles = articles.filter(article => parseInt(id) === parseInt(article.articleId))
      return articles.length ? articles : null
    } else {
      return null
    }
  },
  getArticlesByUid: (state) => (uid, user) => {
    let articles = state.articles

    if (Array.isArray(articles)) {
      if (user) {
        if (state.user && state.user.name === user) {
          uid = 1
        } else {
          for (const [index, article] of articles.entries()) {
            if (article.uname === user) {
              uid = article.uid
              break
            }
          }
        }
      }

      articles = articles.filter(article => parseInt(uid) === parseInt(article.uid))
      return articles.length ? articles : null
    } else {
      return null
    }
  },
  getArticlesByFilter: (state, getters) => (filter) => {
    let articles = state.articles
    let filteredArticles = null

    if (Array.isArray(articles)) {
      filteredArticles = articles.map(article => ({ ...article }))

      switch(filter) {
        case 'excellent':
          filteredArticles = getters.getArticlesByUid(1)
          break
        case 'vote':
          filteredArticles.sort((a, b) => {
            const aVotes = Array.isArray(a.votes) ? a.votes : []
            const bVotes = Array.isArray(b.votes) ? b.votes : []

            return bVotes.length - aVotes.length
          })

          break
        case 'recent':
          filteredArticles.reverse()
          break
        case 'noreply':
          filteredArticles.sort((a, b) => {
            const aComments = Array.isArray(a.comments) ? a.comments : []
            const bComments = Array.isArray(b.comments) ? b.comments : []

            return aComments.length - bComments.length
          })

          break
        default:
          filteredArticles.sort((a, b) => {
            const aComments = Array.isArray(a.comments) ? a.comments : []
            const bComments = Array.isArray(b.comments) ? b.comments : []
            const aCommentsLength = aComments.length
            const bCommentsLength = bComments.length

            if (aCommentsLength > 0) {
              if (bCommentsLength > 0) {
                return new Date(bComments[bCommentsLength - 1].date) - new Date(aComments[aCommentsLength - 1].date)
              } else {
                return -1
              }
            } else {
              return 1
            }
          })

          break
      }
    }

    return filteredArticles
  },
  getArticlesByKeyword: (state) => (keyword) => {
    let articles = state.articles

    if (Array.isArray(articles)) {
      let searchedArticles = []

      articles.map((article) => {
        let { title, content, uname, avatar, articleId } = article
        const regex = new RegExp(`(${keyword})`, 'gi')

        if (title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1) {
          const url = `${state.origin}/articles/${articleId}/content`
          title = title.replace(regex, '<span class="highlight">$1</span>')
          content = content.substr(0, 100).replace(regex, '<span class="highlight">$1</span>')
          uname = uname || (state.user ? state.user.name : '佚名')
          avatar = avatar || (state.user ? state.user.avatar : 'https://api.adorable.io/avatars/200/佚名.png')
          searchedArticles.push({...article, ...{ title, content, uname, avatar, url }})
        }
      })

      return searchedArticles
    } else {
      return null
    }
  }
}
