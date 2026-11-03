import { useEffect, useMemo, useState } from 'react'
import { LayoutDashboard, ArrowLeftRight, Wallet, Target, Plus, Search, Bell, ChevronDown, ArrowUpRight, ArrowDownRight, PiggyBank, Menu, X, Trash2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { seedTransactions, seedBudgets, money } from './data'

const COLORS = ['#6759e8', '#22a06b', '#f59e0b', '#ec6b8b', '#39a7c8', '#8b93a7']
const nav = [{ label: 'Overview', icon: LayoutDashboard }, { label: 'Transactions', icon: ArrowLeftRight }, { label: 'Budgets', icon: Target }]

function read(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}
function StatCard({ title, value, hint, icon: Icon, tone }) {
  return <article className="stat-card"><div className="stat-top"><span>{title}</span><span className={`stat-icon ${tone}`}><Icon size={18}/></span></div><strong>{value}</strong><small>{hint}</small></article>
}
function TransactionList({ items, onDelete, compact = false }) {
  return <div className="transaction-list">{items.slice(0, compact ? 5 : 100).map(t => <div className="transaction-row" key={t.id}>
    <div className="transaction-symbol">{t.type === 'income' ? <ArrowDownRight size={18}/> : <ArrowUpRight size={18}/>}</div>
    <div className="transaction-main"><b>{t.title}</b><small>{t.category} · {new Date(`${t.date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small></div>
    <strong className={t.type === 'income' ? 'positive' : ''}>{t.type === 'income' ? '+' : '−'}{money(t.amount)}</strong>
    {!compact && <button className="icon-button delete" title="Delete transaction" onClick={() => onDelete(t.id)}><Trash2 size={16}/></button>}
  </div>)}</div>
}
function AddTransaction({ onAdd, onClose }) {
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), type: 'expense', note: '' })
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  function submit(e) { e.preventDefault(); if (!form.title.trim() || Number(form.amount) <= 0) return; onAdd({ ...form, amount: Number(form.amount), id: Date.now() }); onClose() }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><form className="modal" onSubmit={submit}>
    <div className="modal-head"><div><span className="eyebrow">YOUR MONEY, YOUR PLAN</span><h2>Add transaction</h2></div><button type="button" className="icon-button" onClick={onClose}><X/></button></div>
    <div className="type-switch"><button type="button" className={form.type === 'expense' ? 'selected expense' : ''} onClick={() => setForm({...form,type:'expense'})}>Expense</button><button type="button" className={form.type === 'income' ? 'selected income' : ''} onClick={() => setForm({...form,type:'income'})}>Income</button></div>
    <label>Description<input name="title" value={form.title} onChange={update} placeholder="e.g. Supermarket" required /></label>
    <div className="form-grid"><label>Amount (£)<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={update} placeholder="0.00" required /></label><label>Date<input name="date" type="date" value={form.date} onChange={update} required /></label></div>
    <label>Category<select name="category" value={form.category} onChange={update}>{['Food','Housing','Transport','Bills','Entertainment','Health','Shopping','Income','Other'].map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Note <input name="note" value={form.note} onChange={update} placeholder="Optional note" /></label>
    <button className="primary full" type="submit"><Plus size={17}/> Save transaction</button>
  </form></div>
}
export default function App() {
  const [transactions, setTransactions] = useState(() => read('pennywise-transactions', seedTransactions))
  const [budgets, setBudgets] = useState(() => read('pennywise-budgets', seedBudgets))
  const [active, setActive] = useState('Overview')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  useEffect(() => localStorage.setItem('pennywise-transactions', JSON.stringify(transactions)), [transactions])
  useEffect(() => localStorage.setItem('pennywise-budgets', JSON.stringify(budgets)), [budgets])

  const totals = useMemo(() => transactions.reduce((a,t) => { a[t.type] += t.amount; return a }, { income: 0, expense: 0 }), [transactions])
  const balance = totals.income - totals.expense
  const expenses = transactions.filter(t => t.type === 'expense')
  const categoryTotals = Object.entries(expenses.reduce((a,t) => { a[t.category] = (a[t.category] || 0) + t.amount; return a }, {})).map(([name,value]) => ({name,value})).sort((a,b) => b.value-a.value)
  const chartData = ['Jul','Aug','Sep','Oct','Nov','Dec'].map((month,i) => ({ month, income: [2800,3000,2950,3150,3670,0][i], expenses: [1900,2100,2050,2300,1403,0][i] }))
  const filtered = transactions.filter(t => `${t.title} ${t.category}`.toLowerCase().includes(search.toLowerCase())).sort((a,b) => b.date.localeCompare(a.date))
  const budgetSpent = category => expenses.filter(t => t.category === category).reduce((s,t) => s+t.amount, 0)
  const add = t => setTransactions(old => [t, ...old])
  const remove = id => setTransactions(old => old.filter(t => t.id !== id))

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}><div className="brand"><span className="brand-mark"><Wallet size={21}/></span><span>Pennywise</span><button className="icon-button close-nav" onClick={() => setMobileNav(false)}><X/></button></div>
      <div className="workspace-label">WORKSPACE</div><nav>{nav.map(n => <button key={n.label} className={`nav-item ${active === n.label ? 'active' : ''}`} onClick={() => {setActive(n.label);setMobileNav(false)}}><n.icon size={18}/>{n.label}</button>)}</nav>
      <div className="sidebar-bottom"><div className="tip-card"><span className="tip-icon"><PiggyBank size={20}/></span><b>Small steps add up.</b><p>Keep an eye on your spending and make your goals happen.</p></div><div className="profile"><div className="avatar">JD</div><div><b>Jamie Davis</b><small>Personal account</small></div><ChevronDown size={16}/></div></div>
    </aside>
    {mobileNav && <div className="mobile-scrim" onClick={() => setMobileNav(false)} />}
    <main className="main-content"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="today-label">Tuesday, 3 November 2026</span><button className="icon-button notification"><Bell size={18}/><i/></button><div className="avatar small-avatar">JD</div></div></header>
      <div className="page-content"><div className="page-heading"><div><span className="eyebrow">TUESDAY, 3 NOVEMBER 2026</span><h1>{active === 'Overview' ? 'Your finances, at a glance.' : active}</h1><p>{active === 'Overview' ? 'Here’s what’s happening with your money.' : active === 'Transactions' ? 'Track every pound coming in and going out.' : 'Set limits and stay in control of your spending.'}</p></div><button className="primary" onClick={() => setShowModal(true)}><Plus size={18}/> Add transaction</button></div>
      {active === 'Overview' && <>
        <section className="stats-grid"><StatCard title="Total balance" value={money(balance)} hint="Income minus expenses" icon={Wallet} tone="purple"/><StatCard title="Total income" value={money(totals.income)} hint="Across all transactions" icon={ArrowDownRight} tone="green"/><StatCard title="Total expenses" value={money(totals.expense)} hint="Across all transactions" icon={ArrowUpRight} tone="orange"/><StatCard title="Savings rate" value={`${totals.income ? Math.max(0, balance/totals.income*100).toFixed(1) : 0}%`} hint="Of recorded income" icon={PiggyBank} tone="pink"/></section>
        <section className="dashboard-grid"><article className="panel chart-panel"><div className="panel-heading"><div><h2>Cash flow</h2><p>Income vs. expenses · illustrative monthly trend</p></div><span className="period-pill">Last 6 months <ChevronDown size={14}/></span></div><div className="chart-legend"><span><i className="legend-income"/> Income</span><span><i className="legend-expense"/> Expenses</span></div><div className="area-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:8,left:-20,bottom:0}}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6b5ce7" stopOpacity={.2}/><stop offset="100%" stopColor="#6b5ce7" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#9299aa',fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#9299aa',fontSize:11}} tickFormatter={v=>`£${v/1000}k`}/><Tooltip formatter={v=>money(v)}/><Area type="monotone" dataKey="income" stroke="#6b5ce7" strokeWidth={2.5} fill="url(#incomeFill)"/><Area type="monotone" dataKey="expenses" stroke="#26a879" strokeWidth={2.5} fill="transparent"/></AreaChart></ResponsiveContainer></div></article>
          <article className="panel spending-panel"><div className="panel-heading"><div><h2>Spending breakdown</h2><p>Where your money goes</p></div></div>{categoryTotals.length ? <><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryTotals} dataKey="value" nameKey="name" innerRadius={62} outerRadius={86} paddingAngle={3} stroke="none">{categoryTotals.map((x,i)=><Cell key={x.name} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>money(v)}/></PieChart></ResponsiveContainer><div className="donut-center"><b>{money(totals.expense)}</b><small>Total spent</small></div></div><div className="category-legend">{categoryTotals.slice(0,4).map((x,i)=><div key={x.name}><span><i style={{background:COLORS[i%COLORS.length]}}/>{x.name}</span><b>{money(x.value)}</b></div>)}</div></> : <p className="empty-state">Add an expense to see your breakdown.</p>}</article>
        </section>
        <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent transactions</h2><p>Your latest money movements</p></div><button className="text-button" onClick={()=>setActive('Transactions')}>View all <ArrowUpRight size={15}/></button></div><TransactionList items={filtered} onDelete={remove} compact/></section>
      </>}
      {active === 'Transactions' && <section className="panel full-panel"><div className="panel-heading"><div><h2>All transactions</h2><p>{transactions.length} records · newest first</p></div><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions"/></div></div><TransactionList items={filtered} onDelete={remove}/>{!filtered.length && <p className="empty-state">No transactions match your search.</p>}</section>}
      {active === 'Budgets' && <section className="panel full-panel"><div className="panel-heading"><div><h2>Monthly budgets</h2><p>Progress against your category limits</p></div><button className="text-button" onClick={()=>setBudgets(old=>[...old,{id:Date.now(),category:'Other',limit:100}])}><Plus size={15}/> Add budget</button></div><div className="budget-list">{budgets.map((b,i)=>{const spent=budgetSpent(b.category), pct=spent/b.limit*100;return <div className="budget-item" key={b.id}><div className="budget-meta"><div><span className="budget-dot" style={{background:COLORS[i%COLORS.length]}}/><b>{b.category}</b></div><span>{money(spent)} <small>of {money(b.limit)}</small></span></div><div className="progress-track"><div className={`progress-fill ${pct>100?'over':''}`} style={{width:`${Math.min(pct,100)}%`,background:COLORS[i%COLORS.length]}}/></div><div className="budget-foot"><small>{pct>100?'Over budget':`${Math.round(pct)}% used`}</small><small>{money(Math.max(0,b.limit-spent))} remaining</small></div></div>})}</div></section>}
      <footer>© 2026 Pennywise <span>Demo app · Your data stays in this browser</span></footer></div>
    </main>
    {showModal && <AddTransaction onAdd={add} onClose={()=>setShowModal(false)}/>}
  </div>
}