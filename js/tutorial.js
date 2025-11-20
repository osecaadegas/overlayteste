// ==================== TUTORIAL MODULE ====================

class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        title: "Bem-vindo ao Painel de Overlay",
        icon: "👋",
        content: `
          <p>Este tutorial interativo vai guiar-te por todas as funcionalidades do painel de overlay para streamers.</p>
          <p>Podes navegar usando os botões <span class="tutorial-highlight">Próximo/Anterior</span>, ou saltar a qualquer momento.</p>
          <p>Vamos começar!</p>
        `
      },
      {
        title: "Widget Spotify",
        icon: '<img src="./assets/music.png" style="width: 32px; height: 32px;">',
        content: `
          <p>O <span class="tutorial-highlight">botão Spotify</span> (ícone de música) permite-te mostrar a música que estás a ouvir na stream.</p>
          <ul>
            <li>Clica no ícone de música para abrir o widget Spotify</li>
            <li>Conecta a tua conta Spotify</li>
            <li>A música atual será exibida com a capa do álbum</li>
            <li>Perfeito para partilhar a tua playlist com os espectadores</li>
          </ul>
        `
      },
      {
        title: "Painel Bonus Hunt",
        icon: '<img src="./assets/crossair.png" style="width: 32px; height: 32px;">',
        content: `
          <p>O <span class="tutorial-highlight">Painel BH</span> (ícone de mira) é a tua ferramenta principal para gerir bonus hunts.</p>
          <ul>
            <li><strong>Start/Stop Money:</strong> Define o teu saldo para acompanhamento</li>
            <li><strong>Nome da Slot:</strong> Escreve o nome da slot - o autocomplete vai ajudar!</li>
            <li><strong>Bet Size:</strong> Introduz o valor da tua aposta</li>
            <li><strong>Super Checkbox:</strong> Marca bónus especiais super</li>
            <li><strong>Slot Image:</strong> Adiciona URLs de imagens personalizadas para slots que não estão na base de dados</li>
          </ul>
          <p class="tutorial-warning">⚠️ Pressiona Enter ou clica fora para adicionar o bónus à tua lista!</p>
        `
      },
      {
        title: "Imagens Personalizadas de Slots",
        icon: "🖼️",
        content: `
          <p>Não tens uma slot na base de dados? Sem problema!</p>
          <ul>
            <li>Introduz o nome da slot primeiro</li>
            <li>Clica no botão <span class="tutorial-highlight">🖼️ Slot Image</span></li>
            <li>Cola o URL da imagem de qualquer website</li>
            <li>Pressiona Enter para guardar</li>
            <li>A tua imagem personalizada aparecerá agora para essa slot</li>
          </ul>
        `
      },
      {
        title: "Abertura de Bónus",
        icon: "▶️",
        content: `
          <p>Quando estiveres pronto para abrir os bónus recolhidos:</p>
          <ul>
            <li>Clica em <span class="tutorial-highlight">Bonus Opening</span> no Painel BH</li>
            <li>Todos os teus bónus serão exibidos por ordem</li>
            <li>Clica num bónus para revelá-lo com animação</li>
            <li>Introduz o valor do pagamento</li>
            <li>Vê as tuas estatísticas atualizarem em tempo real</li>
            <li>Vê as melhores e piores slots automaticamente destacadas</li>
          </ul>
        `
      },
      {
        title: "Editar Slots",
        icon: "✏️",
        content: `
          <p>Precisas de fazer alterações à tua lista de bónus?</p>
          <ul>
            <li>Clica em <span class="tutorial-highlight">Edit Slots</span> no Painel BH</li>
            <li>O teu painel principal de lista de bónus aparecerá</li>
            <li>Edita os pagamentos diretamente clicando nos valores</li>
            <li>Apaga bónus individuais com o ícone de lixo</li>
            <li>Limpa todos os bónus se quiseres começar de novo</li>
          </ul>
        `
      },
      {
        title: "Seletor Aleatório de Slots",
        icon: '<img src="./assets/randomslot.png" style="width: 32px; height: 32px;">',
        content: `
          <p>Não consegues decidir qual slot jogar? Deixa o destino decidir!</p>
          <ul>
            <li>Clica no ícone <span class="tutorial-highlight">Random Slot</span></li>
            <li>Uma slot aleatória da base de dados será selecionada</li>
            <li>Exibe a imagem e nome da slot com animação</li>
            <li>Ótimo para interações com o chat e desafios</li>
          </ul>
        `
      },
      {
        title: "Rastreador de Torneios",
        icon: '<img src="./assets/tornament.png" style="width: 32px; height: 32px;">',
        content: `
          <p>A fazer um torneio? Acompanha tudo aqui!</p>
          <ul>
            <li>Clica no ícone <span class="tutorial-highlight">Torneio</span></li>
            <li>Adiciona participantes com as suas apostas</li>
            <li>Acompanha o progresso e pagamentos</li>
            <li>Vê as classificações automaticamente ordenadas</li>
            <li>Exibe o vencedor com animação de celebração</li>
          </ul>
        `
      },
      {
        title: "Painel de Personalização",
        icon: '<img src="./assets/palet.png" style="width: 32px; height: 32px;">',
        content: `
          <p>Torna o overlay verdadeiramente teu!</p>
          <ul>
            <li>Clica no ícone <span class="tutorial-highlight">Paleta</span></li>
            <li><strong>Tab Tema:</strong> Altera cores, fontes e estilos</li>
            <li><strong>Tab Layout:</strong> Ajusta posicionamento e tamanhos</li>
            <li><strong>Tab Presets:</strong> Temas predefinidos rápidos</li>
            <li>Todas as alterações aplicam-se instantaneamente</li>
          </ul>
        `
      },
      {
        title: "Bloquear/Desbloquear & Mais",
        icon: '<img src="./assets/unlock.png" style="width: 32px; height: 32px;">',
        content: `
          <p>Funcionalidades adicionais úteis:</p>
          <ul>
            <li><strong>Botão Bloquear:</strong> Evita edições acidentais durante a stream</li>
            <li><strong>Logo:</strong> Clica no logo da navbar para enviar branding personalizado</li>
            <li><strong>Nome do Streamer:</strong> Clica para editar o teu nome de exibição</li>
            <li><strong>Website:</strong> Clica para editar o URL do teu website</li>
            <li><strong>Imagem de Publicidade:</strong> Envia imagens promocionais</li>
            <li><strong>Banner de Conteúdo:</strong> Clica para alternar entre banners</li>
          </ul>
        `
      },
      {
        title: "Está Tudo Pronto!",
        icon: "✅",
        content: `
          <p>Parabéns! Agora sabes como usar todas as funcionalidades.</p>
          <p><strong>Dicas Rápidas:</strong></p>
          <ul>
            <li>Pressiona ESC a qualquer momento para fechar painéis</li>
            <li>A maioria dos campos suporta a tecla Enter para guardar</li>
            <li>Passa o rato sobre os botões para tooltips adicionais</li>
            <li>Clica neste <span class="tutorial-highlight">botão ?</span> a qualquer momento para rever</li>
          </ul>
          <p style="text-align: center; margin-top: 20px; font-size: 1.2rem; color: #00e1ff;">
            Boas streams! 🎬
          </p>
        `
      }
    ];
    this.init();
  }

  init() {
    console.log('Tutorial Manager initialized');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close tutorial button
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');
    if (closeTutorialBtn) {
      closeTutorialBtn.addEventListener('click', () => this.closeTutorial());
    }

    // Navigation buttons
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');
    const skipBtn = document.getElementById('tutorial-skip');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousStep());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.closeTutorial());
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      const tutorialOverlay = document.getElementById('tutorial-overlay');
      if (e.key === 'Escape' && tutorialOverlay && tutorialOverlay.style.display !== 'none') {
        this.closeTutorial();
      }
    });
  }

  openTutorial() {
    console.log('Opening tutorial...');
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    if (!tutorialOverlay) {
      console.error('Tutorial overlay not found!');
      return;
    }

    console.log('Tutorial overlay found, displaying...');
    this.currentStep = 0;
    tutorialOverlay.style.display = 'flex';
    this.renderSteps();
    this.updateNavigation();
    this.updateProgress();
    console.log('Tutorial opened successfully');
  }

  closeTutorial() {
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    if (!tutorialOverlay) return;

    tutorialOverlay.style.display = 'none';
  }

  renderSteps() {
    const tutorialContent = document.getElementById('tutorial-content');
    if (!tutorialContent) return;

    tutorialContent.innerHTML = '';

    this.steps.forEach((step, index) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = `tutorial-step${index === this.currentStep ? ' active' : ''}`;
      stepDiv.innerHTML = `
        <h3><span class="tutorial-step-icon">${step.icon}</span> ${step.title}</h3>
        ${step.content}
      `;
      tutorialContent.appendChild(stepDiv);
    });
  }

  updateNavigation() {
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');

    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 0;
    }

    if (nextBtn) {
      if (this.currentStep === this.steps.length - 1) {
        nextBtn.textContent = 'Concluir ✓';
      } else {
        nextBtn.textContent = 'Próximo →';
      }
    }
  }

  updateProgress() {
    const currentStepSpan = document.getElementById('current-step');
    const totalStepsSpan = document.getElementById('total-steps');

    if (currentStepSpan) {
      currentStepSpan.textContent = this.currentStep + 1;
    }

    if (totalStepsSpan) {
      totalStepsSpan.textContent = this.steps.length;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.renderSteps();
      this.updateNavigation();
      this.updateProgress();
    } else {
      this.closeTutorial();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderSteps();
      this.updateNavigation();
      this.updateProgress();
    }
  }
}

// Export class to window (will be instantiated by main app)
if (typeof window !== 'undefined') {
  window.TutorialManager = TutorialManager;
}
