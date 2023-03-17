const root = document.getElementById('root');
root.classList.add('root');

const div1 = document.createElement('div');
const div2 = document.createElement('div');

div1.classList.add('part1');
div2.classList.add('part2');

root.append(div1, div2);

window.addEventListener('popstate', () => {
  const hash = window.location.hash;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id || !hash || (hash !== '#preview' && hash !== '#edit' && hash !== '#add')) {
    window.location.replace('/index.html');
  } else if (hash === '#preview') {
    renderMovieInfo(id);
  } else if (hash === '#edit') {
    editMovieForm(id);
  } else if (hash === '#add') {
    addMovieForm();
  } else {
    console.error('/index.html');
  }
});

const ul = document.createElement('ul');
ul.classList.add('movie-list');

const LOCAL_KEY = 'movies';
const arrFilms = JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? [...initialFilms];

function renderMovieList() {
  arrFilms.forEach(el => ul.append(addMovieItem(el)));
}
renderMovieList();

const btnAdd = document.createElement('button');
btnAdd.textContent = 'add new movie';
btnAdd.classList.add('movie-list__btn-add');
btnAdd.addEventListener('click', e => {
  e.preventDefault();
  div2.innerHTML = '';
  const id = Date.now().toString();
  addMovieForm(id);
  history.pushState({ id }, 'movie', '#add');
});

div1.append(ul, btnAdd);

function addMovieItem(movie) {
  const li = document.createElement('li');
  li.classList.add('movie-list__item');

  const h2Title = document.createElement('h2');
  h2Title.textContent = movie.title;
  h2Title.classList.add('movie-list__title');
  h2Title.setAttribute('data-id', movie.id);
  h2Title.addEventListener('click', e => {
    e.preventDefault();
    div2.innerHTML = '';
    const id = e.target.getAttribute('data-id');
    renderMovieInfo(id);
    history.pushState({ id }, 'movie', `?id=${id}#preview`);
  });

  const btn = document.createElement('button');
  btn.textContent = 'edit';
  btn.classList.add('movie-list__btn');
  btn.setAttribute('data-id', movie.id);
  btn.addEventListener('click', e => {
    e.preventDefault();
    const id = e.target.getAttribute('data-id');
    editMovieForm(id);
    history.pushState({ id }, 'movie', `?id=${id}#edit`);
  });
  li.append(h2Title, btn);
  return li;
}

function renderMovieInfo(id) {
  const movieItem = arrFilms.find(el => el.id === id);

  const div = document.createElement('div');
  div.classList.add('movie');

  const h2Title = document.createElement('h2');
  h2Title.classList.add('movie__title');
  h2Title.textContent = movieItem.title;

  const pCategory = document.createElement('p');
  pCategory.classList.add('movie__category');
  pCategory.textContent = movieItem.category;

  const img = document.createElement('img');
  img.classList.add('movie__img');
  img.src = movieItem.imageUrl;
  img.alt = 'movie image';

  const pDescription = document.createElement('p');
  pDescription.classList.add('movie__description');
  pDescription.textContent = movieItem.plot;

  div.append(h2Title, pCategory, img, pDescription);

  div2.innerHTML = '';
  div2.append(div);
}

function editMovieForm(id) {
  const movieItem = arrFilms.find(el => el.id === id);

  const form = document.createElement('form');
  form.classList.add('edit-form');

  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('edit-form__fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'edit the movie:';
  fieldset.append(legend);

  const labelTitle = document.createElement('label');
  labelTitle.textContent = 'movie title: ';
  const inputTitle = document.createElement('input');
  inputTitle.value = movieItem.title;
  labelTitle.append(inputTitle);

  const labelCategory = document.createElement('label');
  labelCategory.textContent = 'movie category: ';
  const inputCategory = document.createElement('input');
  inputCategory.value = movieItem.category;
  labelCategory.append(inputCategory);

  const labelImgURL = document.createElement('label');
  labelImgURL.textContent = 'movie image URL: ';
  const inputImgURL = document.createElement('input');
  inputImgURL.value = movieItem.imageUrl;
  labelImgURL.append(inputImgURL);

  const labelDescription = document.createElement('label');
  labelDescription.textContent = 'movie description: ';
  const inputDescription = document.createElement('textarea');
  inputDescription.setAttribute('rows', 10);
  inputDescription.value = movieItem.plot;
  labelDescription.append(inputDescription);

  fieldset.append(labelTitle, labelCategory, labelImgURL, labelDescription);

  const btnOK = document.createElement('button');
  btnOK.textContent = 'save';
  btnOK.classList.add('edit-form__btn-ok');

  btnOK.addEventListener('click', e => {
    e.preventDefault();
    movieItem.title = inputTitle.value;
    movieItem.category = inputCategory.value;
    movieItem.imageUrl = inputImgURL.value;
    movieItem.plot = inputDescription.value;
    syncMovies();
    showModal('movie updated successfully', false);
    renderMovieInfo(id);
  });

  const btnCancel = document.createElement('button');
  btnCancel.textContent = 'cancel';
  btnCancel.classList.add('edit-form__btn-cancel');

  btnCancel.addEventListener('click', e => {
    e.preventDefault();
    showModal('undo changes?', true);
  });

  form.append(fieldset, btnOK, btnCancel);
  div2.innerHTML = '';
  div2.append(form);
}

function addMovieForm(id) {
  const form = document.createElement('form');
  form.classList.add('add-form');

  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('add-form__fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'add a new movie:';
  fieldset.append(legend);

  const labelTitle = document.createElement('label');
  labelTitle.textContent = 'movie title: ';
  const inputTitle = document.createElement('input');
  labelTitle.append(inputTitle);

  const labelCategory = document.createElement('label');
  labelCategory.textContent = 'movie category: ';
  const inputCategory = document.createElement('input');
  labelCategory.append(inputCategory);

  const labelImgURL = document.createElement('label');
  labelImgURL.textContent = 'movie image URL: ';
  const inputImgURL = document.createElement('input');
  labelImgURL.append(inputImgURL);

  const labelDescription = document.createElement('label');
  labelDescription.textContent = 'movie description: ';
  const inputDescription = document.createElement('textarea');
  inputDescription.setAttribute('rows', 10);
  labelDescription.append(inputDescription);

  fieldset.append(labelTitle, labelCategory, labelImgURL, labelDescription);

  const btnOK = document.createElement('button');
  btnOK.textContent = 'save';
  btnOK.classList.add('add-form__btn-ok');

  btnOK.addEventListener('click', e => {
    e.preventDefault();
    const newMovie = {
      id,
      title: inputTitle.value || 'no title',
      category: inputCategory.value || 'not known',
      imageUrl: inputImgURL.value || './imgs/baseImg.jpg',
      plot: inputDescription.value || 'not known',
    };
    arrFilms.push(newMovie);
    syncMovies();
    showModal('the movie succesful added');
    renderMovieInfo(id);
  });

  const btnCancel = document.createElement('button');
  btnCancel.textContent = 'cancel';
  btnCancel.classList.add('add-form__btn-cancel');

  btnCancel.addEventListener('click', e => {
    e.preventDefault();
    showModal('undo?', true);
  });

  form.append(fieldset, btnOK, btnCancel);
  div2.innerHTML = '';
  div2.append(form);
}

function showModal(message, isCancel) {
  const modalDiv = document.createElement('div');
  modalDiv.classList.add('modal-ovarlay');
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const text = document.createElement('p');
  text.textContent = message;
  text.classList.add('modal__message');
  const btnOk = document.createElement('button');
  btnOk.textContent = 'OK';
  btnOk.classList.add('modal__btn-ok');
  btnOk.addEventListener('click', e => {
    e.preventDefault();
    if (isCancel) history.back();
    modalDiv.remove();
  });

  modal.append(text, btnOk);

  if (isCancel) {
    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'cancel';
    btnCancel.classList.add('modal__btn-cancel');
    btnCancel.addEventListener('click', e => {
      e.preventDefault();
      modalDiv.remove();
    });
    modal.append(btnCancel);
  }

  modalDiv.append(modal);
  root.append(modalDiv);
}

function syncMovies() {
  ul.innerHTML = '';
  div1.innerHTML = '';
  renderMovieList();
  localStorage.setItem(LOCAL_KEY, JSON.stringify(arrFilms));
  div1.append(ul, btnAdd);
  div2.innerHTML = '';
}
