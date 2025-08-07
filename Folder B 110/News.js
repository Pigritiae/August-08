const NEWS_URL = 'https://servicodados.ibge.gov.br/api/v3/noticias/?atd=10';

function loadNews() {
    console.log('Carregando notícias...');
    console.log('API da URL:', NEWS_URL);

    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        newsContainer.innerHTML = '<p>Carregando notícias...</p>';
    }

    fetch(NEWS_URL)
        .then(response => {
            console.log('Resposta recebida. Status:', response.status);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);

            if (!newsContainer) {
                console.error('Elemento news-container não encontrado no DOM');
                return;
            }

            if (!data.items || data.items.length === 0) {
                console.log('Nenhuma notícia encontrada');
                newsContainer.innerHTML = `
                <div class="news-item">
                    <h3>Nenhuma Notícia Encontrada no Momento.</h3>
                    <p>Tente novamente mais tarde ou verifique sua conexão.</p>
                </div>
                `;
                return;
            }

            newsContainer.innerHTML = ''; // Limpa o "Carregando notícias..."

            data.items.forEach((news, index) => {
                console.log(`Processando notícia ${index + 1}:`, news.titulo);
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';

                // Correção: Acessando a propriedade 'data_publicacao' e usando a variável 'publishedData' corretamente.
                const publishedData = news.data_publicacao ? new Date(news.data_publicacao).toLocaleString('pt-BR') : 'Data não disponível';

                newsItem.innerHTML = `
                    <h3>${news.titulo || 'Sem Título'}</h3>
                    <p class="news-date">${publishedData}</p>
                    <p class="news-intro">${news.introducao || ''}</p>
                    ${news.link ? `<a href="${news.link}" target="_blank" class="read-more">Leia Mais</a>` : ''}
                `;
                // Correção: Usando a variável 'newsContainer' para adicionar o item.
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar notícias:', error);
            if (newsContainer) {
                newsContainer.innerHTML = `
                <div class="error-message">
                    <p>Não foi possível carregar as notícias no momento.</p>
                    <p>Tente novamente mais tarde ou verifique sua conexão com a internet.</p>
                    <button onclick="loadNews()" class="retry-button">Tentar Novamente</button>
                </div>
                `;
            }
        });
}

window.onload = loadNews;
/* código corrigido pela IA Gemini */