import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Newspaper, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Phone, 
  Calendar, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  Award, 
  Users, 
  Clock, 
  ExternalLink,
  Code,
  PlusCircle,
  CheckCircle2,
  Bell,
  ArrowRight,
  Bookmark,
  UserCheck,
  Building,
  Mail
} from 'lucide-react';

// Interface completa do Departamento refletindo a estrutura JSON
interface DepartmentManagement {
  head: string;        // Chefia
  viceHead: string;    // Subchefia
  secretary: string;   // Secretaria
}

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  management: DepartmentManagement;
  professors: string[];
  courses: string[];
  laboratories: string[];
}

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

interface PostGradProgram {
  id: string;
  name: string;
  code: string;
  degree: string;
  description: string;
  researchLines: string[];
}

// Banco de Dados JSON dos Departamentos Acadêmicos
const initialDepartmentsData: Department[] = [
  {
    id: "civil",
    name: "Departamento de Engenharia Civil",
    code: "DECIV",
    description: "Formação sólida em estruturas, geotecnia, transportes e construção civil com forte inserção em grandes obras de infraestrutura.",
    management: {
      head: "Prof. Alberto de Oliveira",
      viceHead: "Profa. Elaine Toscano",
      secretary: "Secretaria DECIV - Bloco A, Sala 5001 (civil@eng.uerj.br)"
    },
    professors: [
      "Profa. Elaine Toscano",
      "Prof. Carlos Eduardo de Oliveira",
      "Profa. Maria Fernanda Leão",
      "Prof. Ricardo Nascimento"
    ],
    courses: ["Graduação em Engenharia Civil", "Ênfase em Estruturas", "Ênfase em Geotecnia"],
    laboratories: ["Laboratório de Mecânica dos Solos", "Laboratório de Estruturas", "Lab. de Materiais de Construção"]
  },
  {
    id: "eletrica",
    name: "Departamento de Engenharia Elétrica",
    code: "DEEL",
    description: "Atuação em sistemas de energia, eletrônica, telecomunicações, sistemas de controle e automação industrial.",
    management: {
      head: "Prof. Michel Pompeu Tcheou",
      viceHead: "Prof. Fernando Lessa",
      secretary: "Secretaria DEEL - Bloco A, Sala 5005 (eletrica@eng.uerj.br)"
    },
    professors: [
      "Prof. Michel Pompeu Tcheou",
      "Prof. Alexandre Santos",
      "Profa. Luciana Ribeiro",
      "Prof. Rodrigo Peixoto"
    ],
    courses: ["Graduação em Engenharia Elétrica", "Ênfase em Telecomunicações", "Ênfase em Sistemas de Potência"],
    laboratories: ["LARISA - Redes Industriais e Automação", "Laboratório de Processamento de Sinais", "Lab. de Alta Tensão"]
  },
  {
    id: "mecanica",
    name: "Departamento de Engenharia Mecânica",
    code: "DEMEC",
    description: "Desenvolvimento de projetos térmicos, fluidores, sistemas mecânicos, manufatura e integridade estrutural.",
    management: {
      head: "Prof. Carlos Cezar de La Plata",
      viceHead: "Prof. André Luiz da Silva",
      secretary: "Secretaria DEMEC - Bloco B, Sala 5010 (mecanica@eng.uerj.br)"
    },
    professors: [
      "Prof. Carlos Cezar de La Plata",
      "Prof. André Luiz da Silva",
      "Profa. Beatris Gonçalves"
    ],
    courses: ["Graduação em Engenharia Mecânica"],
    laboratories: ["Laboratório de Termociências", "Lab. de Ensaios Não Destrutivos", "Lab. de CAD/CAM"]
  },
  {
    id: "producao",
    name: "Departamento de Engenharia de Produção",
    code: "DEPROD",
    description: "Gestão integrada de processos industriais, logística, pesquisa operacional, finanças e gestão da qualidade.",
    management: {
      head: "Prof. Dércio Santiago da Silva Júnior",
      viceHead: "Profa. Ana Paula Martins",
      secretary: "Secretaria DEPROD - Bloco B, Sala 5014 (producao@eng.uerj.br)"
    },
    professors: [
      "Prof. Dércio Santiago da Silva Júnior",
      "Profa. Ana Paula Martins",
      "Prof. Roberto Farias"
    ],
    courses: ["Graduação em Engenharia de Produção (Matriz Nova 2026)"],
    laboratories: ["Laboratório de Simulação de Processos", "Lab. de Engenharia de Fatores Humanos"]
  },
  {
    id: "sanitaria",
    name: "Departamento de Engenharia Sanitária e do Meio Ambiente",
    code: "DESMA",
    description: "Foco em saneamento básico, tratamento de águas e efluentes, contaminação ambiental e sustentabilidade.",
    management: {
      head: "Profa. Daniele Maia Bila",
      viceHead: "Prof. Marcos Paulo Souza",
      secretary: "Secretaria DESMA - Bloco A, Sala 5020 (desma@eng.uerj.br)"
    },
    professors: [
      "Profa. Daniele Maia Bila",
      "Prof. Marcos Paulo Souza",
      "Profa. Claudia Costa"
    ],
    courses: ["Graduação em Engenharia Sanitária e Meio Ambiente"],
    laboratories: ["Laboratório de Análise de Águas e Efluentes (LAE)", "Lab. de Microbiologia Ambiental"]
  },
  {
    id: "cartografica",
    name: "Departamento de Engenharia Cartográfica",
    code: "DECART",
    description: "Ciência da geoinformação, fotogrametria, sensoriamento remoto por satélites e drones, e cartografia web.",
    management: {
      head: "Prof. Luiz Henrique Castiglione",
      viceHead: "Prof. João Bosco",
      secretary: "Secretaria DECART - Bloco A, Sala 5025 (cartografica@eng.uerj.br)"
    },
    professors: [
      "Prof. Luiz Henrique Castiglione",
      "Prof. João Bosco",
      "Profa. Patricia Lima"
    ],
    courses: ["Graduação em Engenharia Cartográfica"],
    laboratories: ["Laboratório de Sensoriamento Remoto", "Lab. de Fotogrametria Digital"]
  },
  {
    id: "renovaveis",
    name: "Departamento de Engenharia de Energias Renováveis",
    code: "DEER",
    description: "Primeiro curso pós-regulamentação do Brasil focado em energia solar, eólica, biomassa e transição energética.",
    management: {
      head: "Prof. Fernando Henrique Mello",
      viceHead: "Profa. Vanessa Rocha",
      secretary: "Secretaria DEER - Bloco B, Sala 5030 (renovaveis@eng.uerj.br)"
    },
    professors: [
      "Prof. Fernando Henrique Mello",
      "Profa. Vanessa Rocha",
      "Prof. Gabriel Mendonça"
    ],
    courses: ["Graduação em Engenharia de Energias Renováveis"],
    laboratories: ["Laboratório de Energia Solar e Fotovoltaica", "Lab. de Hidrogênio Verde"]
  }
];

// Dados das Notícias
const initialNewsData: NewsItem[] = [
  {
    id: "news-2026-001",
    title: "Uerj Lança Curso de Engenharia de Energias Renováveis",
    summary: "Campo de atuação para profissional formado na área é amplo e atende às demandas de transição energética.",
    content: "A Universidade do Estado do Rio de Janeiro (Uerj) anuncia o lançamento do seu novo curso de graduação em Engenharia de Energias Renováveis na Faculdade de Engenharia (FEN).",
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
    title: "Professores da FEN tomaram posse como Conselheiros Regionais do Crea-RJ",
    summary: "Cerimônia de posse ocorreu em 8 de janeiro de 2026 fortalecendo a representatividade da universidade no Conselho.",
    content: "Docentes da Faculdade de Engenharia da UERJ tomaram posse oficial como Conselheiros Regionais no CREA-RJ.",
    category: "secfen",
    categoryLabel: "Comunicados Administrativos",
    publishedAt: "2026-01-08",
    author: "Diretoria FEN",
    featuredImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80",
    isHero: true
  }
];

// Pós-Graduação
const postGradData: PostGradProgram[] = [
  {
    id: "pepes",
    name: "Programa de Pós-Graduação em Engenharia de Processos Sanitários e Ambientais",
    code: "PEPES",
    degree: "Mestrado e Doutorado",
    description: "Excelência na pesquisa de tecnologias limpas e recursos hídricos.",
    researchLines: ["Tecnologias de Tratamento de Águas", "Gestão Ambiental Urbana"]
  }
];

export default function App() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartmentsData);
  const [news, setNews] = useState<NewsItem[]>(initialNewsData);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedNewsModal, setSelectedNewsModal] = useState<NewsItem | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'news' | 'departments' | 'postgrad' | 'secfen' | 'jsonView'>('home');

  // Input para adicionar novos departamentos via JSON na interface
  const [jsonDeptInput, setJsonDeptInput] = useState<string>(
    JSON.stringify({
      id: "mecanica-aero",
      name: "Departamento de Engenharia Aeroespacial",
      code: "DEAERO",
      description: "Departamento voltado para mecânica de voo, propulsão e aerodinâmica.",
      management: {
        head: "Prof. Roberto Silva",
        viceHead: "Profa. Julia Lima",
        secretary: "Secretaria DEAERO - Bloco B, Sala 5040 (aero@eng.uerj.br)"
      },
      professors: ["Prof. Roberto Silva", "Profa. Julia Lima"],
      courses: ["Graduação em Engenharia Aeroespacial"],
      laboratories: ["Túnel de Vento", "Lab. de Simuladores"]
    }, null, 2)
  );

  const heroNews = useMemo(() => news.filter(n => n.isHero || n.featuredImage), [news]);

  const handleAddDeptFromJson = () => {
    try {
      const parsed = JSON.parse(jsonDeptInput);
      if (!parsed.id || !parsed.name || !parsed.management) {
        alert("O JSON de departamento precisa conter 'id', 'name' e a estrutura 'management'.");
        return;
      }
      setDepartments([...departments, parsed]);
      alert("Novo departamento cadastrado com sucesso!");
    } catch (e) {
      alert("Erro de sintaxe no JSON inserido.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white border-b-4 border-cyan-600 sticky top-0 z-40 shadow-lg">
        <div className="bg-slate-950 py-1.5 px-4 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span>Universidade do Estado do Rio de Janeiro — Faculdade de Engenharia (FEN)</span>
            <div className="flex gap-4">
              <a href="https://www.uerj.br" target="_blank" rel="noreferrer" className="hover:text-cyan-400">Portal UERJ</a>
              <button onClick={() => setCurrentTab('secfen')} className="hover:text-cyan-400">SECFEN</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => { setCurrentTab('home'); setSelectedDepartment(null); }} className="cursor-pointer flex items-center gap-3">
            <div className="bg-cyan-600 p-2.5 rounded-lg text-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">FEN UERJ</h1>
              <p className="text-xs text-slate-300 uppercase font-medium">Faculdade de Engenharia</p>
            </div>
          </div>

          <nav className="flex gap-2 text-sm font-medium">
            <button onClick={() => { setCurrentTab('home'); setSelectedDepartment(null); }} className={`px-3 py-2 rounded ${currentTab === 'home' ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:bg-slate-800'}`}>Início</button>
            <button onClick={() => setCurrentTab('news')} className={`px-3 py-2 rounded ${currentTab === 'news' ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:bg-slate-800'}`}>Notícias</button>
            <button onClick={() => { setCurrentTab('departments'); setSelectedDepartment(null); }} className={`px-3 py-2 rounded ${currentTab === 'departments' ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:bg-slate-800'}`}>Departamentos & Cursos</button>
            <button onClick={() => setCurrentTab('secfen')} className={`px-3 py-2 rounded ${currentTab === 'secfen' ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:bg-slate-800'}`}>SECFEN</button>
            <button onClick={() => setCurrentTab('jsonView')} className={`px-3 py-2 rounded flex items-center gap-1 ${currentTab === 'jsonView' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-300'}`}><Code className="w-4 h-4"/> Gerenciador JSON</button>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">

        {/* HOMEPAGE */}
        {currentTab === 'home' && (
          <div className="space-y-10">
            {/* Cursos em Destaque */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6 flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-cyan-600" /> Cursos de Graduação
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">Exibindo a totalidade dos cursos ofertados pela FEN UERJ</p>
                </div>
                <span className="bg-cyan-100 text-cyan-800 font-bold px-3 py-1 rounded-full text-xs">
                  {departments.length} Departamentos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {departments.map((dept) => (
                  <div 
                    key={dept.id} 
                    onClick={() => { setSelectedDepartment(dept); setCurrentTab('departments'); }}
                    className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-bold">{dept.code}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-2">{dept.name}</h3>
                      <p className="text-slate-600 text-xs line-clamp-3 mb-3">{dept.description}</p>
                    </div>
                    <span className="text-xs font-bold text-cyan-700 flex items-center gap-1 pt-2 border-t border-slate-200">
                      Ver detalhes do departamento <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* DEPARTAMENTOS E CURSOS (VISUALIZAÇÃO COMPLETA DOS DADOS DO JSON) */}
        {currentTab === 'departments' && (
          <div className="space-y-6">
            {!selectedDepartment ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <div 
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept)}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-cyan-500 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="bg-cyan-100 text-cyan-800 text-xs font-mono font-bold px-2 py-1 rounded">{dept.code}</span>
                      <h2 className="text-xl font-bold text-slate-900 mt-2 mb-2">{dept.name}</h2>
                      <p className="text-slate-600 text-xs mb-4">{dept.description}</p>
                      
                      <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 mb-4">
                        <p><strong>Chefia:</strong> {dept.management.head}</p>
                        <p><strong>Subchefia:</strong> {dept.management.viceHead}</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-cyan-700 flex items-center gap-1 pt-3 border-t">
                      Ver corpo docente e cursos &rarr;
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* DETALHAMENTO DO DEPARTAMENTO SELECIONADO */
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                <button 
                  onClick={() => setSelectedDepartment(null)}
                  className="text-xs font-bold text-cyan-700 hover:underline"
                >
                  &larr; Voltar para todos os departamentos
                </button>

                <div className="border-b border-slate-200 pb-6">
                  <span className="bg-cyan-100 text-cyan-800 font-mono text-xs font-bold px-3 py-1 rounded">
                    {selectedDepartment.code}
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{selectedDepartment.name}</h1>
                  <p className="text-slate-600 text-sm mt-2">{selectedDepartment.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Coluna Esquerda: Cursos e Professores */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-cyan-600" /> Cursos Oferecidos
                      </h3>
                      <ul className="space-y-2">
                        {selectedDepartment.courses.map((course, idx) => (
                          <li key={idx} className="bg-slate-50 p-3 rounded-lg text-xs font-semibold text-slate-800 border border-slate-200">
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-600" /> Corpo Docente / Professores
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedDepartment.professors.map((prof, idx) => (
                          <div key={idx} className="bg-slate-50 p-2.5 rounded text-xs text-slate-700 border border-slate-200 flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-cyan-600 shrink-0" />
                            <span>{prof}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita: Gestão, Secretaria e Laboratórios */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
                      <h3 className="font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-2">
                        <Building className="w-5 h-5 text-cyan-600" /> Estrutura Administrativa
                      </h3>
                      
                      <div className="text-xs space-y-2 text-slate-700">
                        <p><strong>Chefia do Departamento:</strong> {selectedDepartment.management.head}</p>
                        <p><strong>Subchefia:</strong> {selectedDepartment.management.viceHead}</p>
                        <p><strong>Secretaria:</strong> {selectedDepartment.management.secretary}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
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
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* GERENCIADOR DE JSON DE DEPARTAMENTOS */}
        {currentTab === 'jsonView' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">Injetor de JSON de Departamentos</h1>
              <p className="text-slate-600 text-xs mt-1">
                Você pode simular ou colar o conteúdo de qualquer arquivo JSON de departamento abaixo para adicioná-lo dinamicamente à memória da aplicação:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-5 rounded-xl text-slate-100 font-mono text-xs flex flex-col">
                <h3 className="text-amber-400 font-bold mb-2">JSON do Departamento</h3>
                <textarea 
                  value={jsonDeptInput}
                  onChange={(e) => setJsonDeptInput(e.target.value)}
                  rows={16}
                  className="w-full bg-slate-950 text-emerald-400 p-3 rounded border border-slate-800 focus:outline-none"
                />
                <button 
                  onClick={handleAddDeptFromJson}
                  className="mt-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded transition-colors"
                >
                  Injetar Departamento no Site
                </button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 max-h-[500px] overflow-y-auto space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Departamentos Carregados ({departments.length})</h3>
                {departments.map((d) => (
                  <div key={d.id} className="p-3 bg-slate-50 rounded border text-xs font-mono">
                    <p className="font-bold text-slate-900 font-sans">{d.name} ({d.code})</p>
                    <p className="text-slate-500 text-[10px]">Chefia: {d.management.head}</p>
                    <p className="text-slate-500 text-[10px]">Professores: {d.professors.length} cadastrados</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t-4 border-cyan-700 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p>Faculdade de Engenharia — UERJ | Pavilhão João Lyra Filho</p>
          <p>© 2026 FEN UERJ — Todos os direitos reservados</p>
        </div>
      </footer>

    </div>
  );
}