import { useState, useEffect, useMemo } from 'react';
import logo from './assets/logo.png';
import {
  Search,
  Newspaper,
  BookOpen,
  Building2,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  ExternalLink,
  Code,
  PlusCircle,
  CheckCircle2,
  Bell,
  ArrowRight,
  Bookmark
} from 'lucide-react';

// Interfaces TypeScript
interface Attachment {
  name: string;
  url: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'secfen' | 'conc' | 'curso' | 'evento' | 'estag' | 'alocsala' | 'destaque';
  categoryLabel: string;
  publishedAt: string;
  author: string;
  featuredImage?: string;
  attachments?: Attachment[];
  departmentId?: string;
  isHero?: boolean;
}

interface Department {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  coordinator: string;
  contactEmail: string;
  courses: string[];
  laboratories: string[];
}

interface PostGradProgram {
  id: string;
  name: string;
  code: string;
  degree: string;
  description: string;
  researchLines: string[];
}

// Banco de Dados em Formato JSON Simulando a Pasta /news
const initialNewsData: NewsItem[] = [
  {
    id: "news-2026-001",
    title: "Uerj Lança Curso de Engenharia de Energias Renováveis, o Primeiro Após o Reconhecimento da Profissão no Brasil",
    summary: "Campo de atuação para profissional formado na área é amplo e atende às demandas de transição energética.",
    content: "A Universidade do Estado do Rio de Janeiro (Uerj) anuncia o lançamento do seu novo curso de graduação em Engenharia de Energias Renováveis na Faculdade de Engenharia (FEN). Trata-se do primeiro curso no país criado após a regulamentação oficial da profissão no Brasil. O profissional atuará em projetos de energia solar, eólica, biomassa e hidrogênio verde.",
    category: "destaque",
    categoryLabel: "Cursos & Notícias",
    publishedAt: "2026-01-09",
    author: "Comunicação FEN/UERJ",
    featuredImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1000&q=80",
    isHero: true,
    departmentId: "renovaveis"
  },
  {
    id: "news-2026-002",
    title: "Professores da FEN tomaram posse como Conselheiros Regionais do Crea-RJ representando a Uerj",
    summary: "Cerimônia de posse ocorreu em 8 de janeiro de 2026 fortalecendo a representatividade da universidade no Conselho.",
    content: "Docentes da Faculdade de Engenharia da UERJ tomaram posse oficial como Conselheiros Regionais no CREA-RJ. A presença de professores da FEN garante a colaboração contínua da universidade nas diretrizes técnicas, éticas e de fiscalização da engenharia no estado do Rio de Janeiro.",
    category: "secfen",
    categoryLabel: "Comunicados Administrativos",
    publishedAt: "2026-01-08",
    author: "Diretoria FEN",
    featuredImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80",
    isHero: true
  },
  {
    id: "news-2026-003",
    title: "Curso de Férias 2026 - Disciplinas do Instituto de Matemática e Estatística (IME)",
    summary: "Divulgação da classificação preliminar dos inscritos no Curso de Férias 2026.",
    content: "A Secretaria Geral de Graduação (SECFEN) informa a publicação da classificação preliminar para as disciplinas do IME ofertadas no Curso de Férias de 2026. Alunos devem conferir a lista em anexo e observar os prazos para eventuais recursos.",
    category: "secfen",
    categoryLabel: "SECFEN / Graduação",
    publishedAt: "2026-01-06",
    author: "SECFEN",
    attachments: [
      { name: "Classificação_Preliminar_Curso_Ferias_2026.pdf", url: "#" }
    ]
  },
  {
    id: "news-2026-004",
    title: "Programa de Estágio Subsea7 2026 - Inscrições Abertas",
    summary: "Oportunidades de estágio para estudantes dos cursos de Engenharia Mecânica, Elétrica, Civil e Produção.",
    content: "Estão abertas as inscrições para o Programa de Estágio Subsea7 2026! A empresa líder em engenharia submarina e serviços para a indústria de energia busca alunos da FEN UERJ. Benefícios incluem bolsa auxílio compatível, plano de saúde e previdência privada.",
    category: "estag",
    categoryLabel: "Estágios, Bolsas e Empregos",
    publishedAt: "2026-01-05",
    author: "Coordenação de Estágios FEN",
    featuredImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    isHero: true
  },
  {
    id: "news-2026-005",
    title: "EDITAL Nº 1 - Opção pelo Novo Curso de Engenharia de Produção",
    summary: "Instruções para alunos ativos que desejam realizar a migração de matriz curricular.",
    content: "A Direção da Faculdade de Engenharia publica o Edital nº 1 referente à opção de migração de alunos para a nova matriz do curso de Engenharia de Produção. Consulte o edital completo para verificar equivalências de disciplinas e impacto no CR.",
    category: "secfen",
    categoryLabel: "Comunicados Administrativos",
    publishedAt: "2026-01-04",
    author: "SECFEN",
    departmentId: "producao"
  },
  {
    id: "news-2026-006",
    title: "Bolsa para Técnico PROATEC no Laboratório LARISA-UERJ",
    summary: "Abertura de seleção para bolsa no Laboratório de Redes Industriais e Sistemas de Automação.",
    content: "O Laboratório de Redes Industriais e Sistemas de Automação (LARISA-UERJ) comunica a abertura de vaga de bolsa PROATEC para suporte técnico em projetos de automação industrial e IoT. Requisitos incluem conhecimentos em redes industriais e programação.",
    category: "estag",
    categoryLabel: "Estágios e Bolsas",
    publishedAt: "2025-12-28",
    author: "LARISA / FEN",
    departmentId: "eletrica"
  },
  {
    id: "news-2026-007",
    title: "The 1st Automatic Control Meeting - Control In Rio 2025",
    summary: "Evento internacional realizado em dezembro reuniu especialistas da Engenharia de Controle e Automação.",
    content: "Ocorreu nos dias 4, 5, 8 e 15 de dezembro de 2025 o 'Control In Rio 2025', organizado pelo Departamento de Engenharia Eletrônica e de Telecomunicações. O evento contou com palestras de pesquisadores de renome internacional e apresentações de trabalhos de pós-graduação.",
    category: "evento",
    categoryLabel: "Palestras e Eventos",
    publishedAt: "2025-12-16",
    author: "Departamento de Engenharia Elétrica",
    departmentId: "eletrica"
  },
  {
    id: "news-2026-008",
    title: "Solicitação de Mudança de Ênfase 2026/1",
    summary: "Período para requerimento de mudança de ênfase entre as engenharias da FEN.",
    content: "A Secretaria Geral de Graduação informa aos discentes o cronograma oficial para requerer Mudança de Ênfase no período 2026/1. As solicitações devem ser enviadas pelo formulário oficial de atendimento discente.",
    category: "secfen",
    categoryLabel: "SECFEN",
    publishedAt: "2025-11-30",
    author: "SECFEN"
  },
  {
    id: "news-2026-009",
    title: "Conheça Melhor o Curso de Engenharia Ambiental e Sanitária",
    summary: "Entrevista especial com a Profa. Daniele Maia Bila sobre o papel desse engenheiro na sociedade.",
    content: "Você sabe o que faz um profissional de Engenharia Ambiental e Sanitária? Em bate-papo exclusivo, a Profa. Daniele Maia Bila fala sobre o papel crucial desses profissionais no saneamento básico, gestão de recursos hídricos e transição ecológica, além de diferenciar a atuação em relação à engenharia florestal e ambiental.",
    category: "curso",
    categoryLabel: "Nossos Cursos",
    publishedAt: "2025-10-15",
    author: "Comunicação FEN",
    featuredImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80",
    departmentId: "desma"
  },
  {
    id: "news-2026-010",
    title: "A Engenharia Cartográfica no Nosso Cotidiano: Dos Mapas à Cartografia Web",
    summary: "Entrevista com o Prof. Luiz Henrique Castiglione e Prof. João Bosco sobre geoinformação e GPS.",
    content: "Ferramentas como Waze e Google Maps têm o trabalho direto do engenheiro cartógrafo. Em entrevistas especiais para a TV Uerj e projeto Múltipla Escolha, professores da FEN detalham como a cartografia digital e os sistemas de informação geográfica revolucionaram o mercado de trabalho.",
    category: "curso",
    categoryLabel: "Nossos Cursos",
    publishedAt: "2025-09-20",
    author: "TV Uerj / FEN",
    departmentId: "carto"
  }
];

// Dados de Todos os Departamentos Acadêmicos e Cursos
const departmentsData: Department[] = [
    {
    id: "estr",
    name: "Engenharia Ambiental e Sanitária",
    code: "ESTR",
    icon: "Leaf",
    description: "lorem ipsum",
    coordinator: "Profa. ",
    contactEmail: "estr@eng.uerj.br",
    courses: ["Graduação em Engenharia Civil"],
    laboratories: []
  },
  {
    id: "desma",
    name: "Engenharia Sanitária e Meio-Ambiente",
    code: "DESMA",
    icon: "Leaf",
    description: "Foco em saneamento básico, tratamento de águas e efluentes, contaminação ambiental e sustentabilidade.",
    coordinator: "Profa. Daniele Maia Bila",
    contactEmail: "desma@eng.uerj.br",
    courses: ["Graduação em Engenharia Ambiental e Sanitária"],
    laboratories: ["Laboratório de Análise de Águas e Efluentes (LAE)", "Lab. de Microbiologia Ambiental"]
  },
  {
    id: "carto",
    name: "Engenharia Cartográfica",
    code: "CARTO",
    icon: "Map",
    description: "Ciência da geoinformação, fotogrametria, sensoriamento remoto por satélites e drones, e cartografia web.",
    coordinator: "Prof. Luiz Henrique Castiglione / Prof. João Bosco",
    contactEmail: "cartografica@eng.uerj.br",
    courses: ["Graduação em Engenharia Cartográfica"],
    laboratories: ["Laboratório de Sensoriamento Remoto", "Lab. de Fotogrametria Digital"]
  },
  {
    id: "dcct",
    name: "Engenharia Civil",
    code: "DCCT",
    icon: "Building2",
    description: "Formação sólida em estruturas, geotecnia, transportes e construção civil com forte inserção em grandes obras de infraestrutura.",
    coordinator: "Profa. Elaine Toscano (Vice-Chefe)",
    contactEmail: "civil@eng.uerj.br",
    courses: ["Graduação em Engenharia Civil", "Ênfase em Estruturas", "Ênfase em Geotecnia"],
    laboratories: ["Laboratório de Mecânica dos Solos", "Laboratório de Estruturas", "Lab. de Materiais de Construção"]
  },
  {
    id: "eletrica",
    name: "Engenharia Elétrica",
    code: "ELE",
    icon: "Zap",
    description: "Atuação em sistemas de energia, eletrônica, telecomunicações, sistemas de controle e automação industrial.",
    coordinator: "Prof. Michel Pompeu Tcheou",
    contactEmail: "eletrica@eng.uerj.br",
    courses: ["Graduação em Engenharia Elétrica", "Ênfase em Telecomunicações", "Ênfase em Sistemas de Potência"],
    laboratories: ["LARISA - Redes Industriais e Automação", "Laboratório de Processamento de Sinais", "Lab. de Alta Tensão"]
  },
    {
    id: "detel",
    name: "Engenharia Eletrônica e Telecomunicações",
    code: "DETEL",
    icon: "Zap",
    description: "Atuação em letrônica, telecomunicações, sistemas de controle e automação",
    coordinator: "Prof. Michel Pompeu Tcheou",
    contactEmail: "eletronica@eng.uerj.br",
    courses: ["Graduação em Engenharia Eletrônicaca", "Ênfase em Telecomunicações", "Ênfase em Sistemas de Potência"],
    laboratories: ["LARISA - Redes Industriais e Automação", "Laboratório de Processamento de Sinais", "Lab. de Alta Tensão"]
  },
  {
    id: "mecanica",
    name: "Engenharia Mecânica",
    code: "MECAN",
    icon: "Cog",
    description: "Desenvolvimento de projetos térmicos, fluidores, sistemas mecânicos, manufatura e integridade estrutural.",
    coordinator: "Prof. Carlos Cezar de La Plata",
    contactEmail: "mecanica@eng.uerj.br",
    courses: ["Graduação em Engenharia Mecânica"],
    laboratories: ["Laboratório de Termociências", "Lab. de Ensaios Não Destrutivos", "Lab. de CAD/CAM"]
  },
  {
    id: "producao",
    name: "Engenharia de Produção",
    code: "DEIN",
    icon: "Briefcase",
    description: "Gestão integrada de processos industriais, logística, pesquisa operacional, finanças e gestão da qualidade.",
    coordinator: "Prof. Dércio Santiago da Silva Júnior",
    contactEmail: "producao@eng.uerj.br",
    courses: ["Graduação em Engenharia de Produção (Matriz Nova 2026)"],
    laboratories: ["Laboratório de Simulação de Processos", "Lab. de Engenharia de Fatores Humanos"]
  },
  {
    id: "desc",
    name: "Engenharia de Sistemas e Computação",
    code: "DESC",
    icon: "Sun",
    description: "Primeiro curso de engenharia de computação do Brasil.",
    coordinator: "",
    contactEmail: "desc@eng.uerj.br",
    courses: ["Graduação em Engenharia de Computação"],
    laboratories: []
  }
];

// Dados dos Programas de Pós-Graduação
const postGradData: PostGradProgram[] = [
  {
    id: "pepes",
    name: "Programa de Pós-Graduação em Engenharia de Processos Sanitários e Ambientais",
    code: "PEPES",
    degree: "Mestrado e Doutorado",
    description: "Excelência na pesquisa de tecnologias limpas, tratamento avançado de efluentes e recursos hídricos.",
    researchLines: ["Tecnologias de Tratamento de Águas", "Gestão Ambiental Urbana", "Biotecnologia Ambiental"]
  },
  {
    id: "pel",
    name: "Programa de Pós-Graduação em Engenharia Eletrônica",
    code: "PEL",
    degree: "Mestrado e Doutorado",
    description: "Pesquisa avançada em inteligência artificial, processamento de sinais, microeletrônica e automação.",
    researchLines: ["Sistemas Inteligentes e Redes", "Sistemas de Controle", "Telecomunicações e Eletromagnetismo"]
  },
  {
    id: "pgen",
    name: "Programa de Pós-Graduação em Engenharia Mecânica",
    code: "PGEN",
    degree: "Mestrado e Doutorado",
    description: "Estudos em fenômenos de transporte, mecânica dos sólidos, materiais avançados e termoenergia.",
    researchLines: ["Mecânica dos Fluídos e Transferência de Calor", "Integridade Estrutural", "Sistemas Energéticos"]
  },
  {
    id: "pgec",
    name: "Programa de Pós-Graduação em Engenharia Civil",
    code: "PGEC",
    degree: "Mestrado Profissional e Acadêmico",
    description: "Soluções em engenharia de estruturas, geotecnia e sustentabilidade de obras de infraestrutura.",
    researchLines: ["Análise Estrutural e Numérica", "Geotecnia e Meio Ambiente", "Materiais Cimentícios"]
  }
];

export default function App() {
  // Estados da Aplicação
  const [news, setNews] = useState<NewsItem[]>(initialNewsData);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isCarouselAutoplay, setIsCarouselAutoplay] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [_selectedPostGrad, setSelectedPostGrad] = useState<PostGradProgram | null>(null);
  const [selectedNewsModal, setSelectedNewsModal] = useState<NewsItem | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'news' | 'departments' | 'postgrad' | 'secfen' | 'jsonView'>('home');

  // Estado para adicionar nova notícia via JSON
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify({
      id: `news-2026-0${news.length + 1}`,
      title: "Nova Notícia Cadastrada no Portal FEN",
      summary: "Resumo explicativo sobre a nova publicação adicionada via arquivo JSON.",
      content: "Texto completo da notícia inserida através da aba do diretório de notícias JSON no sistema.",
      category: "secfen",
      categoryLabel: "Comunicados Administrativos",
      publishedAt: new Date().toISOString().split('T')[0],
      author: "Secretaria FEN UERJ"
    }, null, 2)
  );
  const [jsonSuccessMsg, setJsonSuccessMsg] = useState<string>('');

  // Notícias do Carrossel de Destaques
  const heroNews = useMemo(() => {
    return news.filter(n => n.isHero || n.featuredImage);
  }, [news]);

  // Rotação Automática do Carrossel
  useEffect(() => {
    if (!isCarouselAutoplay || heroNews.length === 0) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroNews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselAutoplay, heroNews.length]);

  // Filtro de notícias por categoria e busca
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  // Função para adicionar notícia do JSON
  const handleAddNewsFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title || !parsed.content) {
        alert("O JSON precisa conter pelo menos os campos 'title' e 'content'.");
        return;
      }
      const newItem: NewsItem = {
        ...parsed,
        id: parsed.id || `news-${Date.now()}`,
        publishedAt: parsed.publishedAt || new Date().toISOString().split('T')[0],
        category: parsed.category || 'secfen',
        categoryLabel: parsed.categoryLabel || 'Geral'
      };
      setNews([newItem, ...news]);
      setJsonSuccessMsg("Notícia adicionada com sucesso ao diretório /news!");
      setTimeout(() => setJsonSuccessMsg(''), 4000);
    } catch (e) {
      alert("Erro ao validar formato JSON. Verifique a sintaxe.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">

      {/* ===== CABEÇALHO INSTITUCIONAL UERJ/FEN ===== */}
      <header className="bg-slate-900 text-white border-b-4 border-cyan-600 sticky top-0 z-40 shadow-lg">
        {/* Topbar Superior com Contatos do Portal */}
        <div className="bg-slate-950 py-1.5 px-4 border-b border-slate-800 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <span>Universidade do Estado do Rio de Janeiro</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline text-cyan-400 font-medium">Faculdade de Engenharia (FEN)</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.uerj.br" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                Portal UERJ <ExternalLink className="w-3 h-3" />
              </a>
              <span>|</span>
              <button onClick={() => setCurrentTab('secfen')} className="hover:text-cyan-400 transition-colors">
                SECFEN Atendimento
              </button>
            </div>
          </div>
        </div>

        {/* Marca da FEN e Navegação Principal */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            onClick={() => { setCurrentTab('home'); setSelectedDepartment(null); setSelectedPostGrad(null); }}
            className="cursor-pointer flex items-center gap-4 group"
          >
            <img src={logo} alt="FEN UERJ" className="h-14 w-auto group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                FEN UERJ
              </h1>
              <p className="text-xs text-slate-300 tracking-wider uppercase font-medium">
                Faculdade de Engenharia
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => { setCurrentTab('home'); setSelectedDepartment(null); }}
              className={`px-3 py-2 rounded-md transition-all ${currentTab === 'home' ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-200'}`}
            >
              Início
            </button>
            <button
              onClick={() => setCurrentTab('news')}
              className={`px-3 py-2 rounded-md transition-all ${currentTab === 'news' ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-200'}`}
            >
              Notícias
            </button>
            <button
              onClick={() => { setCurrentTab('departments'); setSelectedDepartment(null); }}
              className={`px-3 py-2 rounded-md transition-all ${currentTab === 'departments' ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-200'}`}
            >
              Departamentos & Cursos
            </button>
            <button
              onClick={() => { setCurrentTab('postgrad'); setSelectedPostGrad(null); }}
              className={`px-3 py-2 rounded-md transition-all ${currentTab === 'postgrad' ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-200'}`}
            >
              Pós-Graduação
            </button>
            <button
              onClick={() => setCurrentTab('secfen')}
              className={`px-3 py-2 rounded-md transition-all ${currentTab === 'secfen' ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-200'}`}
            >
              SECFEN
            </button>
            <button
              onClick={() => setCurrentTab('jsonView')}
              className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition-all ${currentTab === 'jsonView' ? 'bg-amber-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'}`}
            >
              <Code className="w-4 h-4" /> Diretório JSON
            </button>
          </nav>
        </div>
      </header>

      {/* ===== BARRA DE AVISO / TICKER EM TEMPO REAL ===== */}
      <div className="bg-cyan-900 text-cyan-100 py-2 px-4 text-xs font-medium border-b border-cyan-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3 overflow-hidden">
          <span className="bg-cyan-700 text-white px-2 py-0.5 rounded font-bold uppercase text-[10px] shrink-0 flex items-center gap-1">
            <Bell className="w-3 h-3" /> Comunicado urgente
          </span>
          <div className="truncate text-slate-200">
            <strong className="text-white">Opção pelo Novo Curso de Engenharia de Produção:</strong> Edital publicado. Alunos interessados devem consultar os requisitos.
          </div>
        </div>
      </div>

      {/* ===== CONTEÚDO PRINCIPAL (MUDANÇA DE ABAS) ===== */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">

        {/* 1. HOMEPAGE */}
        {currentTab === 'home' && (
          <div className="space-y-12">

            {/* ROTAÇÃO DE NOTÍCIAS / CARROSSEL DE DESTAQUE */}
            {heroNews.length > 0 && (
              <section className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                <div className="relative h-[380px] sm:h-[460px] w-full">
                  <img
                    src={heroNews[activeHeroIndex]?.featuredImage || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80"}
                    alt={heroNews[activeHeroIndex]?.title}
                    className="w-full h-full object-cover opacity-35 transition-all duration-700 ease-in-out scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 sm:p-10 flex flex-col justify-end">
                    <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-3">
                      {heroNews[activeHeroIndex]?.categoryLabel}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 max-w-4xl leading-tight">
                      {heroNews[activeHeroIndex]?.title}
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl line-clamp-2 mb-6">
                      {heroNews[activeHeroIndex]?.summary}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedNewsModal(heroNews[activeHeroIndex])}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-md"
                      >
                        Leia a notícia na íntegra <ArrowRight className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {heroNews[activeHeroIndex]?.publishedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controles do Carrossel */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md p-1.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveHeroIndex((prev) => (prev - 1 + heroNews.length) % heroNews.length)}
                    className="p-1.5 hover:bg-slate-800 text-white rounded transition-colors"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsCarouselAutoplay(!isCarouselAutoplay)}
                    className="px-2 py-1 text-xs text-cyan-400 font-mono font-semibold hover:bg-slate-800 rounded"
                  >
                    {isCarouselAutoplay ? 'PAUSAR' : 'GIRAR'}
                  </button>
                  <button
                    onClick={() => setActiveHeroIndex((prev) => (prev + 1) % heroNews.length)}
                    className="p-1.5 hover:bg-slate-800 text-white rounded transition-colors"
                    title="Próxima"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Indicadores numéricos */}
                <div className="absolute bottom-4 right-6 flex gap-1.5">
                  {heroNews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`h-2 rounded-full transition-all ${idx === activeHeroIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-600'}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* SEÇÃO COMPLETA: TODOS OS CURSOS DE ENGENHARIA */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6 border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-cyan-600" />
                    Nossos Cursos de Engenharia
                  </h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    Conheça a totalidade dos cursos de graduação oferecidos pela Faculdade de Engenharia da UERJ ({departmentsData.length} cursos)
                  </p>
                </div>
                <span className="text-xs bg-cyan-100 text-cyan-800 font-bold px-3 py-1 rounded-full border border-cyan-200">
                  {departmentsData.length} Engenharias
                </span>
              </div>

              {/* Todos os 7 Cursos Exibidos Diretamente na Tela Inicial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {departmentsData.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => { setSelectedDepartment(dept); setCurrentTab('departments'); }}
                    className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-cyan-500 hover:bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-14 h-10 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-extrabold text-sm group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                          {dept.code.substring(0, 5)}
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
                          {dept.code}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-cyan-700 transition-colors mb-2">
                        {dept.name}
                      </h3>
                      <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                        {dept.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Ver departamento <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PAINEL DUPLO: ÚLTIMAS NOTÍCIAS + COMUNICADOS POR CATEGORIA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Coluna da Esquerda (2 Terços): Feed de Notícias */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-cyan-600" /> Últimas Notícias do Portal
                  </h2>
                  <button
                    onClick={() => setCurrentTab('news')}
                    className="text-xs font-semibold text-cyan-700 hover:underline"
                  >
                    Ver acervo completo ({news.length})
                  </button>
                </div>

                <div className="space-y-4">
                  {news.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedNewsModal(item)}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-cyan-400 hover:shadow transition-all cursor-pointer flex flex-col sm:flex-row gap-4"
                    >
                      {item.featuredImage && (
                        <img
                          src={item.featuredImage}
                          alt={item.title}
                          className="w-full sm:w-32 h-24 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {item.categoryLabel}
                            </span>
                            <span className="text-xs text-slate-400">
                              {item.publishedAt}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 hover:text-cyan-700 transition-colors text-base line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-slate-600 text-xs line-clamp-2 mt-1">
                            {item.summary}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-cyan-600 mt-2 hover:underline">
                          Leia a notícia na íntegra &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna da Direita (1 Terço): Acesso Rápido por Categoria e SECFEN */}
              <div className="space-y-6">

                {/* Box de Categorias Estilo Portal UERJ */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Bookmark className="w-4 h-4 text-cyan-600" /> Categorias de Notícias
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setSelectedCategory('conc'); setCurrentTab('news'); }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-cyan-50 hover:text-cyan-900 text-xs font-semibold text-slate-700 flex justify-between items-center transition-colors"
                    >
                      <span>Concursos Públicos FEN</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => { setSelectedCategory('secfen'); setCurrentTab('news'); }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-cyan-50 hover:text-cyan-900 text-xs font-semibold text-slate-700 flex justify-between items-center transition-colors"
                    >
                      <span>Comunicados Administrativos (SECFEN)</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => { setSelectedCategory('curso'); setCurrentTab('news'); }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-cyan-50 hover:text-cyan-900 text-xs font-semibold text-slate-700 flex justify-between items-center transition-colors"
                    >
                      <span>Cursos & Extensão</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => { setSelectedCategory('evento'); setCurrentTab('news'); }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-cyan-50 hover:text-cyan-900 text-xs font-semibold text-slate-700 flex justify-between items-center transition-colors"
                    >
                      <span>Palestras, Eventos & Seminários</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => { setSelectedCategory('estag'); setCurrentTab('news'); }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-cyan-50 hover:text-cyan-900 text-xs font-semibold text-slate-700 flex justify-between items-center transition-colors"
                    >
                      <span>Estágios, Bolsas e Empregos</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Card Institucional de Atendimento */}
                <div className="bg-gradient-to-br from-slate-900 to-cyan-950 text-white p-6 rounded-xl shadow-md border border-slate-800">
                  <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    Atendimento Acadêmico
                  </span>
                  <h3 className="text-lg font-bold mt-2 mb-1">Secretaria Geral (SECFEN)</h3>
                  <p className="text-xs text-slate-300 mb-4">
                    Suporte a alunos de graduação, alteração de inscrição, trancamento e colação de grau.
                  </p>
                  <button
                    onClick={() => setCurrentTab('secfen')}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 rounded-lg transition-colors text-center block"
                  >
                    Acessar Serviços SECFEN
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 2. FEED DE NOTÍCIAS COMPLETO */}
        {currentTab === 'news' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Acervo de Notícias e Comunicados</h1>
                <p className="text-slate-500 text-xs">Publicações oficiais e registros históricos recuperados</p>
              </div>

              {/* Barra de Busca de Notícias */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar no acervo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todas as Notícias' },
                { id: 'secfen', label: 'SECFEN / Administrativo' },
                { id: 'conc', label: 'Concursos Públicos' },
                { id: 'curso', label: 'Cursos & Graduação' },
                { id: 'evento', label: 'Eventos & Seminários' },
                { id: 'estag', label: 'Estágios & Bolsas' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat.id ? 'bg-cyan-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Lista de Notícias Filtradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedNewsModal(item)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {item.featuredImage ? (
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-mono">
                        FEN UERJ
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-semibold text-cyan-700 uppercase tracking-wider text-[10px] bg-cyan-50 px-2 py-0.5 rounded">
                          {item.categoryLabel}
                        </span>
                        <span>{item.publishedAt}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 hover:text-cyan-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-xs line-clamp-3 mb-4">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0 border-t border-slate-100 mt-auto flex justify-between items-center text-xs text-slate-500">
                    <span>Por: {item.author}</span>
                    <span className="text-cyan-700 font-bold hover:underline">Ler notícia &rarr;</span>
                  </div>
                </article>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500 text-sm">Nenhuma notícia encontrada para os critérios selecionados.</p>
              </div>
            )}
          </div>
        )}

        {/* 3. DEPARTAMENTOS E CURSOS */}
        {currentTab === 'departments' && (
          <div className="space-y-8">
            {!selectedDepartment ? (
              <>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h1 className="text-2xl font-bold text-slate-900">Departamentos e Cursos de Graduação</h1>
                  <p className="text-slate-600 text-xs mt-1">
                    A Faculdade de Engenharia da UERJ é composta por 9 departamentos acadêmicos especializados que ministram as disciplinas específicas das engenharias.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departmentsData.map((dept) => (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept)}
                      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-cyan-100 text-cyan-800 text-xs font-mono font-bold px-2.5 py-1 rounded">
                            {dept.code}
                          </span>
                          <span className="text-xs text-slate-400">UERJ FEN</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">{dept.name}</h2>
                        <p className="text-slate-600 text-xs mb-4">{dept.description}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-4 mt-auto">
                        <span className="text-xs font-bold text-cyan-700 flex items-center gap-1">
                          Ver corpo docente e matriz curricular <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Detalhe do Departamento Selecionado */
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
                >
                  &larr; Voltar para lista de departamentos
                </button>

                <div className="border-b border-slate-200 pb-6">
                  <span className="bg-cyan-100 text-cyan-800 font-mono text-xs font-bold px-3 py-1 rounded">
                    {selectedDepartment.code}
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{selectedDepartment.name}</h1>
                  <p className="text-slate-600 text-sm mt-2">{selectedDepartment.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <img src={logo} alt="" className="w-5 h-5 object-contain" /> Cursos Oferecidos
                    </h3>
                    <ul className="space-y-2">
                      {selectedDepartment.courses.map((course, idx) => (
                        <li key={idx} className="bg-slate-50 p-3 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                          {course}
                        </li>
                      ))}
                    </ul>

                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pt-4">
                      <Building2 className="w-5 h-5 text-cyan-600" /> Laboratórios de Pesquisa
                    </h3>
                    <ul className="space-y-2">
                      {selectedDepartment.laboratories.map((lab, idx) => (
                        <li key={idx} className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border border-slate-200">
                          {lab}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
                    <h3 className="font-bold text-slate-900 text-base">Informações de Contato</h3>
                    <div className="text-xs space-y-2 text-slate-700">
                      <p><strong>Coordenação/Chefia:</strong> {selectedDepartment.coordinator}</p>
                      <p><strong>E-mail Institucional:</strong> {selectedDepartment.contactEmail}</p>
                      <p><strong>Localização:</strong> Pavilhão João Lyra Filho - Bloco A / Bloco B</p>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-bold text-xs text-slate-900 mb-2">Notícias do Departamento</h4>
                      <div className="space-y-2">
                        {news.filter(n => n.departmentId === selectedDepartment.id).map(n => (
                          <div
                            key={n.id}
                            onClick={() => setSelectedNewsModal(n)}
                            className="bg-white p-2.5 rounded border border-slate-200 hover:border-cyan-500 cursor-pointer text-xs font-medium text-slate-800"
                          >
                            {n.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. PÓS-GRADUAÇÃO */}
        {currentTab === 'postgrad' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">Programas de Pós-Graduação (Stricto Sensu)</h1>
              <p className="text-slate-600 text-xs mt-1">
                Mestrado e Doutorado em Engenharia reconhecidos com altas notas de avaliação CAPES.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postGradData.map((pg) => (
                <div
                  key={pg.id}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-cyan-500 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-cyan-900 text-cyan-200 text-xs font-mono font-bold px-2.5 py-1 rounded">
                        {pg.code}
                      </span>
                      <span className="text-xs font-semibold text-cyan-700">{pg.degree}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">{pg.name}</h2>
                    <p className="text-slate-600 text-xs mb-4">{pg.description}</p>

                    <h4 className="text-xs font-bold text-slate-800 mb-2">Linhas de Pesquisa:</h4>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pg.researchLines.map((line, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded">
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <button
                      onClick={() => alert(`Para mais informações sobre o ${pg.code}, entre em contato com a secretaria de pós-graduação.`)}
                      className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
                    >
                      Informações sobre editais de seleção &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ÁREA DA SECFEN (SECRETARIA DE GRADUAÇÃO) */}
        {currentTab === 'secfen' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 to-cyan-900 text-white p-8 rounded-2xl shadow-md">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-300">SECFEN UERJ</span>
              <h1 className="text-3xl font-extrabold mt-1">Secretaria Geral de Graduação da FEN</h1>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl">
                Atendimento acadêmico centralizado para alunos de todos os cursos de Engenharia da Faculdade de Engenharia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <FileText className="w-8 h-8 text-cyan-600 mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">Requerimentos Acadêmicos</h3>
                <p className="text-slate-600 text-xs mb-3">Solicitações de trancamento de disciplina, isenção, histórico assinado e declarações.</p>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Formulário digital de requerimento."); }} className="text-xs font-bold text-cyan-700 hover:underline">Baixar formulários oficiais &rarr;</a>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <Calendar className="w-8 h-8 text-cyan-600 mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">Calendário & Prazos</h3>
                <p className="text-slate-600 text-xs mb-3">Datas limites para mudança de ênfase, inscrição em disciplinas e prova final.</p>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Calendário Acadêmico 2026/1."); }} className="text-xs font-bold text-cyan-700 hover:underline">Ver calendário completo &rarr;</a>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <Award className="w-8 h-8 text-cyan-600 mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">Colação de Grau</h3>
                <p className="text-slate-600 text-xs mb-3">Instruções e cadastro de formandos para a cerimônia oficial de formatura.</p>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Informações para concluintes."); }} className="text-xs font-bold text-cyan-700 hover:underline">Ver edital de formandos &rarr;</a>
              </div>
            </div>

            {/* Avisos da SECFEN */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-slate-900 text-lg mb-4">Últimos Comunicados da SECFEN</h2>
              <div className="space-y-3">
                {news.filter(n => n.category === 'secfen').map(item => (
                  <div key={item.id} onClick={() => setSelectedNewsModal(item)} className="p-3 bg-slate-50 rounded-lg hover:bg-cyan-50 cursor-pointer border border-slate-200 transition-colors flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.summary}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{item.publishedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. GERENCIADOR DE DIRETÓRIO JSON (NOTÍCIAS) */}
        {currentTab === 'jsonView' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-6 h-6 text-amber-600" />
                <h1 className="text-2xl font-bold text-slate-900">Gerenciador de Diretório JSON (/news)</h1>
              </div>
              <p className="text-slate-600 text-xs">
                Como solicitado na arquitetura serverless, as notícias do site são carregadas via arquivos e objetos JSON. Abaixo você pode visualizar o banco de dados atual e simular a adição de uma nova notícia em formato JSON estruturado.
              </p>
            </div>

            {jsonSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {jsonSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Form de Inserção de JSON */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col">
                <h3 className="text-sm font-bold text-amber-400 font-mono mb-2 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Adicionar Novo Arquivo JSON em /news/
                </h3>
                <p className="text-slate-400 text-xs mb-3">Edite o objeto JSON abaixo para injetar uma nova publicação no portal:</p>

                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={14}
                  className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                <button
                  onClick={handleAddNewsFromJson}
                  className="mt-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded text-xs transition-colors"
                >
                  Carregar Notícia JSON no Portal
                </button>
              </div>

              {/* Estatísticas e Lista de Arquivos JSON no 'Diretório' */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Notícias em Memória ({news.length} arquivos JSON)
                </h3>
                <div className="max-h-[420px] overflow-y-auto space-y-2 pr-2">
                  {news.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-xs">
                      <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                        <span>FILE: /news/{item.id}.json</span>
                        <span>{item.publishedAt}</span>
                      </div>
                      <div className="font-sans font-bold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[10px] text-cyan-700 mt-1">category: "{item.category}"</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ===== MODAL DE LEITURA DA NOTÍCIA ===== */}
      {selectedNewsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">

            {/* Header do Modal */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-600 text-white px-2 py-0.5 rounded">
                  {selectedNewsModal.categoryLabel}
                </span>
                <h2 className="text-xl font-bold mt-2">{selectedNewsModal.title}</h2>
                <span className="text-xs text-slate-400 mt-1 block">
                  Publicado em {selectedNewsModal.publishedAt} por {selectedNewsModal.author}
                </span>
              </div>
              <button
                onClick={() => setSelectedNewsModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
              {selectedNewsModal.featuredImage && (
                <img
                  src={selectedNewsModal.featuredImage}
                  alt={selectedNewsModal.title}
                  className="w-full h-56 object-cover rounded-xl"
                />
              )}

              <div className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg border-l-4 border-cyan-600 text-xs">
                {selectedNewsModal.summary}
              </div>

              <p>{selectedNewsModal.content}</p>

              {/* Anexos da Notícia */}
              {selectedNewsModal.attachments && selectedNewsModal.attachments.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-bold text-xs text-slate-900 mb-2">Documentos e Anexos:</h4>
                  <div className="space-y-1">
                    {selectedNewsModal.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        onClick={(e) => { e.preventDefault(); alert(`Download simulado do arquivo: ${att.name}`); }}
                        className="flex items-center gap-2 text-xs font-semibold text-cyan-700 hover:underline bg-slate-50 p-2 rounded border border-slate-200"
                      >
                        <FileText className="w-4 h-4" /> {att.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedNewsModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Fechar Notícia
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===== RODAPÉ INSTITUCIONAL DA FEN ===== */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t-4 border-cyan-700 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-sm mb-3">Faculdade de Engenharia - UERJ</h3>
            <p className="leading-relaxed text-slate-400">
              Rua São Francisco Xavier, 524 - Maracanã<br />
              Rio de Janeiro - RJ, CEP: 20550-900<br />
              Pavilhão João Lyra Filho - Bloco A e B
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-3">Links Úteis</h3>
            <ul className="space-y-1.5">
              <li><a href="http://www.uerj.br" target="_blank" rel="noreferrer" className="hover:text-cyan-400">Portal UERJ</a></li>
              <li><button onClick={() => setCurrentTab('secfen')} className="hover:text-cyan-400">Secretaria de Graduação (SECFEN)</button></li>
              <li><button onClick={() => setCurrentTab('news')} className="hover:text-cyan-400">Notícias e Editais</button></li>
              <li><button onClick={() => setCurrentTab('postgrad')} className="hover:text-cyan-400">Pós-Graduação</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-3">Recuperação de Dados</h3>
            <p className="leading-relaxed">
              Portal reconstruído com suporte a arquivos JSON e arquitetura serverless baseado no acervo mantido pelo Internet Archive (Wayback Machine).
            </p>
            <p className="text-[10px] text-slate-500 mt-4">
              Copyright © Faculdade de Engenharia da UERJ
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}