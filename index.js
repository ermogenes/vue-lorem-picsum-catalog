const fetchPics = async (page, amount) => {
  const response = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=${amount}`
  );
  return await response.json();
};

const textToClipboard = (textToBeCopied) => {
  if (textToBeCopied) {
    const _temp = document.createElement('input');
    _temp.setAttribute('type', 'text');
    _temp.setAttribute('value', textToBeCopied);
    document.body.appendChild(_temp);
    _temp.select();
    _temp.setSelectionRange(0, 999999); // iOS fix
    execCommand('copy');
    _temp.remove();
  }
};

const myApp = {
  data() {
    return {
      page: 0,
      amount: 50,
      pics: [],
    };
  },

  methods: {
    copyUrl(event) {
      textToClipboard(event.currentTarget.dataset.url);
    },

    async showMorePics() {
      const newPics = await fetchPics(++this.page, this.amount);

      newPics.forEach((pic, index) => {
        let orientation = '';
        if (pic.width > pic.height) {
          orientation = 'landscape';
        } else if (pic.height > pic.width) {
          orientation = 'portrait';
        } else {
          orientation = 'square';
        }
        const ratio = `${(pic.width / pic.height).toFixed(1)}:1`;
        newPics[index].ratio = `${ratio}`;
        newPics[index].orientation = orientation;
        newPics[
          index
        ].loremPicsumUrl = `https://picsum.photos/id/${pic.id}/100`;
        newPics[index].alt = `a Lorem Picsum photo by ${pic.author}`;
      });

      Array.prototype.push.apply(this.pics, newPics);
    },
  },

  beforeMount() {
    this.showMorePics();
  },

  mounted() {
    window.addEventListener('scroll', async () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight > scrollHeight - 1) {
        await this.showMorePics();
      }
    });
  },
};

Vue.createApp(myApp).mount('#app');
