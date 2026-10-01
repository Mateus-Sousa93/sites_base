'use client';

import { useEffect, useRef, useState } from 'react';
import { brand, money, products, type Category, type Product } from '../content';
import { CampaignVideo } from './CampaignVideo';

type BagItem = { product: Product; size: string; quantity: number };
const filters: Array<'Todos' | Category> = ['Todos', 'Sneakers', 'Roupas'];

export function Storefront() {
  const dialogRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos');
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [bag, setBag] = useState<BagItem[]>([]);
  const [drawer, setDrawer] = useState<'menu' | 'bag' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [activeSection, setActiveSection] = useState('inicio');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { threshold: 0.55 });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const count = bag.reduce((sum, item) => sum + item.quantity, 0);
  const total = bag.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const visible = products.filter(p => (filter === 'Todos' || p.category === filter) && `${p.name} ${p.kind}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));

  useEffect(() => {
    if (!drawer) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex="0"]') ?? []);
    focusable()[0]?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawer(null);
      if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [drawer]);

  function add(product: Product) {
    const size = sizes[product.id];
    if (!size) { setNotice(`Escolha um tamanho para ${product.name}.`); return; }
    setBag(previous => {
      const found = previous.find(item => item.product.id === product.id && item.size === size);
      return found ? previous.map(item => item === found ? { ...item, quantity: item.quantity + 1 } : item) : [...previous, { product, size, quantity: 1 }];
    });
    setNotice(`${product.name}, tamanho ${size}, adicionado à sacola.`);
  }
  function changeQuantity(id: string, size: string, amount: number) {
    setBag(previous => previous.map(item => item.product.id === id && item.size === size ? { ...item, quantity: item.quantity + amount } : item).filter(item => item.quantity > 0));
  }
  function choose(next: (typeof filters)[number]) {
    setFilter(next); setQuery(''); setSearchOpen(false); setDrawer(null); document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  }

  return <>
    <header className="header">
      <button className="icon-button menu-button" aria-label="Abrir menu" onClick={() => setDrawer('menu')}><span className="hamburger" /></button>
      <a className="wordmark" href="#inicio">CULTURA DAS <span>RUAS</span></a>
      <nav className="desktop-nav" aria-label="Categorias"><a href="#drop">Novidades</a><button onClick={() => choose('Sneakers')}>Sneakers</button><button onClick={() => choose('Roupas')}>Roupas</button><a href="#sobre">A marca</a></nav>
      <div className="header-actions"><button className="icon-button search-button" aria-label="Buscar produtos" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/></svg></button><button className="icon-button bag-button" aria-label={`Abrir sacola, ${count} itens`} onClick={() => setDrawer('bag')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3.5 8h17l-1 13h-15l-1-13Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg><span className="count">{count}</span></button></div>
      {searchOpen && <form className="search-panel" onSubmit={e => { e.preventDefault(); document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' }); }}><label htmlFor="search">Buscar no catálogo</label><input id="search" value={query} onChange={e => setQuery(e.target.value)} autoFocus placeholder="Sneaker, moletom..." /><button type="submit">Ver resultados →</button></form>}
    </header>
    <nav className="chapter-nav" aria-label="Seções da loja">
      {[['inicio', 'Abertura'], ['drop', 'Drop 01'], ['produtos', 'Coleção'], ['sobre', 'Cultura'], ['contato', 'Seu projeto']].map(([id, label], index) =>
        <a key={id} href={`#${id}`} aria-label={label} aria-current={activeSection === id ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span></a>)}
    </nav>
    <main id="conteudo">
      <section id="inicio" className="hero screen" data-active={activeSection === 'inicio'}>
        <CampaignVideo name="skate-motion" label="Cultura em movimento" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow"><i className="live-dot" /> DROP 01 / SEM ROTEIRO</span>
          <h1>A RUA VESTE<br/>QUEM VOCÊ É.</h1>
          <p>Mais que estilo. É pertencimento.<br/>Seu ritmo. Sua rua. Suas regras.</p>
          <a className="red-button" href="#produtos">EXPLORAR COLEÇÃO <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-stamp" aria-hidden="true">FEITO<br/>PRA<br/><em>MOVER.</em></div>
        <div className="screen-bottom"><span>01 — CULTURA EM MOVIMENTO</span><a href="#drop">CONHEÇA O DROP <b>↓</b></a></div>
      </section>
      <section id="drop" className="drop screen" data-active={activeSection === 'drop'}>
        <div className="drop-copy">
          <span className="eyebrow dark">COLEÇÃO / 001</span>
          <span className="drop-number" aria-hidden="true">01</span>
          <h2>SEM PEDIR<br/><em>LICENÇA.</em></h2>
          <p>Silhuetas amplas. Texturas que marcam.<br/>Essenciais para fazer a cidade do seu jeito.</p>
          <a className="text-link" href="#produtos">CONHEÇA O DROP <span>↗</span></a>
          <div className="drop-tags"><span>OVERSIZED</span><span>STREET ESSENTIALS</span></div>
        </div>
        <div className="drop-art"><div className="drop-art-image"/><div className="editorial-caption"><span>CULTURA DAS RUAS / EDITORIAL 01</span><b>MESMA RUA.<br/>NOVAS HISTÓRIAS.</b></div></div>
      </section>
      <section id="produtos" className="products-section screen" data-active={activeSection === 'produtos'}>
        <div className="section-top"><div><span className="eyebrow">SELEÇÃO / 002</span><h2>ESCOLHA SEU<br/><em>PRÓXIMO PASSO.</em></h2></div><p>Da primeira saída ao último rolê.<br/>O essencial tem personalidade.</p></div>
        <div className="catalog-toolbar"><div className="filter-row" role="group" aria-label="Filtrar produtos">{filters.map(option => <button key={option} className={filter === option ? 'selected' : ''} aria-pressed={filter === option} onClick={() => { setFilter(option); setQuery(''); }}>{option}</button>)}</div><span className="catalog-count" aria-live="polite">{String(visible.length).padStart(2, '0')} PEÇAS</span></div>
        <div className="product-grid" data-count={visible.length}>{visible.map(product => <article className="product-card" key={product.id}>
          <div className={`product-photo quadrant-${product.quadrant}`} role="img" aria-label={`${product.kind} ${product.name}`} />
          {product.tag && <span className="product-tag">{product.tag}</span>}
          <div className="product-info"><div><span className="product-kind">{product.kind}</span><h3>{product.name}</h3></div><strong>{money(product.price)}</strong></div>
          <div className="product-actions"><div className="sizes" role="group" aria-label={`Tamanho de ${product.name}`}>{product.sizes.map(size => <button className={sizes[product.id] === size ? 'active' : ''} aria-pressed={sizes[product.id] === size} onClick={() => setSizes({ ...sizes, [product.id]: size })} key={size}>{size}</button>)}</div>
            <select className="size-select" aria-label={`Tamanho de ${product.name}`} value={sizes[product.id] || ''} onChange={event => setSizes({ ...sizes, [product.id]: event.target.value })}><option value="">Tamanho</option>{product.sizes.map(size => <option key={size} value={size}>{size}</option>)}</select>
            <button className="add-button" aria-label={`Adicionar ${product.name} à sacola`} onClick={() => add(product)}><span>ADICIONAR</span> +</button>
          </div>
        </article>)}</div>
        {!visible.length && <p className="empty-results">Nenhum produto encontrado. <button onClick={() => { setQuery(''); setFilter('Todos'); }}>Ver toda a coleção ↗</button></p>}
        <div className="catalog-bottom"><span>DROP 01 — SUA PRÓXIMA COMBINAÇÃO COMEÇA AQUI.</span><a href="#sobre">SINTA A CULTURA ↓</a></div>
      </section>
      <section id="sobre" className="manifesto screen" data-active={activeSection === 'sobre'}>
        <CampaignVideo name="street-culture" label="Streetwear nas ruas" />
        <div className="manifesto-shade" />
        <div className="manifesto-copy"><span className="eyebrow">A CIDADE É NOSSA PASSARELA</span><h2>NÃO SIGA<br/>O FLUXO.<br/><em>CRIE O SEU.</em></h2><p>Do concreto nasce a atitude.<br/>O resto é você quem faz.</p><a href="#produtos" className="red-button">ENCONTRE SEU ESTILO <span>↗</span></a></div>
        <div className="screen-bottom"><span>04 — SEM RÓTULOS. SEM ROTEIRO.</span><a href="#contato">PRÓXIMO CAPÍTULO <b>↓</b></a></div>
      </section>
      <section id="contato" className="final-cta screen" data-active={activeSection === 'contato'}>
        <div className="cta-orbit" aria-hidden="true">✳</div>
        <div className="cta-copy"><span className="eyebrow dark">ESTÚDIO CONCEITO / DESIGN QUE MOVE</span><h2>SUA MARCA.<br/><em>OUTRO NÍVEL.</em></h2><p>Uma loja que se sente antes de se explicar.<br/>Vamos criar a próxima experiência para a sua marca?</p><a className="red-button" href={brand.contact} target="_blank" rel="noopener noreferrer">CONVERSAR SOBRE MEU SITE <span>↗</span></a></div>
        <footer><a className="wordmark" href="#inicio">CULTURA DAS <span>RUAS</span></a><p>Desenvolvido por <a href="https://www.estudioconceito.com" target="_blank" rel="noopener noreferrer">Estúdio Conceito ↗</a></p><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>
      </section>
    </main>
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Fechar aviso">×</button></div>}
    {drawer && <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setDrawer(null); }}><aside ref={dialogRef} className="drawer" role="dialog" aria-modal="true" aria-label={drawer === 'bag' ? 'Sacola' : 'Menu de navegação'}><div className="drawer-head"><span>{drawer === 'bag' ? `SACOLA / ${count}` : 'MENU'}</span><button onClick={() => setDrawer(null)} aria-label="Fechar">×</button></div>{drawer === 'menu' ? <nav className="drawer-menu"><a href="#drop" onClick={() => setDrawer(null)}>Novidades <span>01</span></a><button onClick={() => choose('Sneakers')}>Sneakers <span>02</span></button><button onClick={() => choose('Roupas')}>Roupas <span>03</span></button><a href="#sobre" onClick={() => setDrawer(null)}>A marca <span>04</span></a></nav> : <div className="bag-content">{bag.length ? <>{bag.map(item => <div className="bag-item" key={`${item.product.id}-${item.size}`}><div className={`bag-photo quadrant-${item.product.quadrant}`} /><div><b>{item.product.name}</b><small>Tamanho {item.size}</small><strong>{money(item.product.price * item.quantity)}</strong><div className="quantity"><button aria-label={`Remover um ${item.product.name}`} onClick={() => changeQuantity(item.product.id, item.size, -1)}>−</button><span>{item.quantity}</span><button aria-label={`Adicionar um ${item.product.name}`} onClick={() => changeQuantity(item.product.id, item.size, 1)}>+</button></div></div></div>)}<div className="bag-total"><span>Subtotal</span><b>{money(total)}</b></div></> : <p className="bag-empty">Sua sacola está vazia. Escolha um produto e tamanho na vitrine.</p>}<a className="red-button" href={brand.contact} target="_blank" rel="noopener noreferrer">QUERO UMA LOJA ASSIM ↗</a></div>}</aside></div>}
  </>;
}
