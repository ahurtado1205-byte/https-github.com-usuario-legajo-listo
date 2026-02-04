import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Users, History, Settings, Search, FileText, Download, Share2,
  CheckCircle2, ChevronRight, UserPlus, Clock, Palmtree, AlertTriangle,
  UserMinus, Mail, MoreVertical, ArrowLeft, Building2, Printer, FileCheck,
  RefreshCw, Filter, HelpCircle, Upload, ExternalLink, X, Info, ShieldCheck, AlertCircle, Camera
} from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_DOCUMENTS, MOCK_COMPANY, DOCUMENT_TEMPLATES, DOCUMENT_CATEGORIES, HELP_ARTICLES } from './data/mock';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// --- Shared Components ---

const Badge = ({ status }) => {
  const labels = {
    draft: 'Borrador',
    issued: 'Emitido',
    notified: 'Notificado',
    signed: 'Firmado',
    Admin: 'Admin'
  };
  return <span className={`badge badge-${status}`}>{labels[status] || status}</span>;
};

const SectionHeader = ({ title, showBack, onBack, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      {showBack && <ArrowLeft onClick={onBack} size={24} style={{ cursor: 'pointer' }} />}
      <h1 style={{ margin: 0, fontSize: '32px' }}>{title}</h1>
    </div>
    {children}
  </div>
);

const RiskBadge = ({ level }) => {
  const settings = {
    low: { color: '#059669', label: 'Riesgo Bajo', icon: ShieldCheck },
    medium: { color: '#d97706', label: 'Riesgo Medio', icon: Info },
    high: { color: '#dc2626', label: 'Riesgo Alto', icon: AlertCircle },
  };
  const { color, label, icon: Icon } = settings[level] || settings.low;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color, fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
      <Icon size={16} /> {label}
    </div>
  );
};

// --- Sidebar & Nav ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: PlusCircle, label: 'Crear' },
    { id: 'employees', icon: Users, label: 'Empleados' },
    { id: 'history', icon: History, label: 'Historial' },
    { id: 'settings', icon: Building2, label: 'Empresa' },
    { id: 'help', icon: HelpCircle, label: 'Ayuda' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FileCheck size={28} color="var(--primary-color)" />
        <span>LegajoListo</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: '0 24px', fontSize: '11px', color: '#718096', opacity: 0.6 }}>
        v1.1.0-IA Compliance
      </div>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: PlusCircle, label: 'Crear' },
    { id: 'employees', icon: Users, label: 'Legajos' },
    { id: 'history', icon: History, label: 'Historial' },
    { id: 'settings', icon: Building2, label: 'Ajustes' }
  ];

  return (
    <nav className="tab-bar">
      {menuItems.map(item => (
        <button
          key={item.id}
          className={`tab-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <item.icon />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Views ---

const HomeView = ({ onStartWizard }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getIcon = (iconName) => {
    const icons = { UserPlus, FileText, RefreshCw, Palmtree, AlertTriangle, UserMinus, Mail };
    const Icon = icons[iconName] || FileText;
    return <Icon size={20} />;
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800 }}>Crear Documentación</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>IA de RR.HH. para Operaciones Gastronómicas</p>
      </div>

      {!selectedCategory ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {DOCUMENT_CATEGORIES.map(cat => (
            <button key={cat.id} className="card"
              style={{
                textAlign: 'left',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                border: '1.5px solid var(--border-color)',
                background: '#fff',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              <div style={{ background: 'var(--bg-color)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                {getIcon(cat.icon)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '17px' }}>{cat.label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cat.docs.length} modelos blindados</div>
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade">
          <SectionHeader title={selectedCategory.label} showBack onBack={() => setSelectedCategory(null)}>
            <p style={{ color: 'var(--text-muted)' }}>Seleccioná una plantilla para iniciar el asistente legal.</p>
          </SectionHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {selectedCategory.docs.map(docId => {
              const template = DOCUMENT_TEMPLATES[docId];
              return (
                <button key={docId} className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    textAlign: 'left',
                    padding: '20px',
                    gap: '12px'
                  }}
                  onClick={() => onStartWizard(docId)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{template.title}</div>
                    <PlusCircle size={20} color="var(--primary-color)" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> v{template.version || '1.0'}
                    </div>
                    <RiskBadge level={template.risk_level} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeesView = ({ employees, setEmployees, onSelectEmployee }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ firstName: '', lastName: '', cuil: '', entryDate: '', legajo: '', dni: '' });

  const handleSave = () => {
    if (!newEmp.firstName || !newEmp.lastName || !newEmp.cuil) {
      alert('Por favor, completa los campos mandatorios.');
      return;
    }

    const createdEmp = {
      id: Date.now().toString(),
      ...newEmp,
      sector: 'General',
      position: 'Operativo',
      status: 'active',
      address: 'No declarado',
      cct: MOCK_COMPANY.cct,
      category: 'Operativo',
      checklist: { dni: false, cuil: false, alta: false, apto: false, cuenta: false }
    };

    setEmployees([...employees, createdEmp]);
    setShowAddModal(false);
    setNewEmp({ firstName: '', lastName: '', cuil: '', entryDate: '', legajo: '', dni: '' });
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <SectionHeader title="Legajos Digitales">
          <p style={{ color: 'var(--text-muted)' }}>{employees.length} colaboradores en nómina</p>
        </SectionHeader>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddModal(true)}>
          <UserPlus size={20} /> Alta Colaborador
        </button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>COLABORADOR</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>LEGAJO</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>CCT / PUESTO</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => onSelectEmployee(emp)}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--bg-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary-color)' }}>{emp.firstName[0]}{emp.lastName[0]}</div>
                    <div style={{ fontWeight: 800 }}>{emp.lastName.toUpperCase()}, {emp.firstName}</div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>{emp.legajo || '(sin legajo)'}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{emp.position}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CCT {emp.cct}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`status-light ${Object.values(emp.checklist).every(v => v) ? 'status-green' : 'status-yellow'}`}></div>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{Object.values(emp.checklist).every(v => v) ? 'AL DÍA' : 'PENDIENTE'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ maxWidth: '600px', width: '100%', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Nuevo Colaborador</h2>
                <X onClick={() => setShowAddModal(false)} style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">APELLIDO</label>
                  <input className="input-field" value={newEmp.lastName} onChange={e => setNewEmp({ ...newEmp, lastName: e.target.value })} placeholder="Pérez" />
                </div>
                <div className="input-group">
                  <label className="input-label">NOMBRE</label>
                  <input className="input-field" value={newEmp.firstName} onChange={e => setNewEmp({ ...newEmp, firstName: e.target.value })} placeholder="Juan" />
                </div>
                <div className="input-group">
                  <label className="input-label">CUIL</label>
                  <input className="input-field" value={newEmp.cuil} onChange={e => setNewEmp({ ...newEmp, cuil: e.target.value })} placeholder="20-30123456-7" />
                </div>
                <div className="input-group">
                  <label className="input-label">DNI</label>
                  <input className="input-field" value={newEmp.dni} onChange={e => setNewEmp({ ...newEmp, dni: e.target.value })} placeholder="30.123.456" />
                </div>
                <div className="input-group">
                  <label className="input-label">NRO. LEGAJO</label>
                  <input className="input-field" value={newEmp.legajo} onChange={e => setNewEmp({ ...newEmp, legajo: e.target.value })} placeholder="L-101" />
                </div>
                <div className="input-group">
                  <label className="input-label">FECHA INGRESO</label>
                  <input className="input-field" type="date" value={newEmp.entryDate} onChange={e => setNewEmp({ ...newEmp, entryDate: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSave}>Guardar Legajo</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Wizard ---

const DocumentWizard = ({ type, employees, onCancel, onFinish }) => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const template = DOCUMENT_TEMPLATES[type];
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        nombre: selectedEmployee.firstName,
        apellido: selectedEmployee.lastName,
        cuil: selectedEmployee.cuil,
        dni: selectedEmployee.dni,
        legajo: selectedEmployee.legajo,
        fecha_ingreso: selectedEmployee.entryDate,
        puesto: selectedEmployee.position,
        sector: selectedEmployee.sector,
        categoria_cct: selectedEmployee.category,
        cct_aplicable: selectedEmployee.cct || MOCK_COMPANY.cct,
        establecimiento_nombre: MOCK_COMPANY.name,
        domicilio_explotacion: MOCK_COMPANY.address,
        fecha_emision: format(new Date(), 'dd/MM/yyyy'),
        lugar: MOCK_COMPANY.city
      });
    }
  }, [selectedEmployee]);

  const filteredEmployees = employees.filter(e =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cuil.includes(searchTerm)
  );

  const renderContent = (body) => {
    let content = body;
    Object.keys(formData).forEach(key => {
      content = content.replaceAll(`{{${key}}}`, formData[key] || `(___)`);
    });
    return content;
  };

  const handleFinish = () => {
    const docCode = `DOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    onFinish({
      id: docCode,
      employeeId: selectedEmployee.id,
      type: type,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'issued',
      vars: formData
    });
  };

  return (
    <div className="wizard-overlay">
      <div className="container" style={{ paddingBottom: '20px', maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={onCancel} className="btn-tab" style={{ color: 'var(--text-muted)', fontWeight: 700 }}>CANCELAR</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= 1 ? 'var(--primary-color)' : '#cbd5e1' }}></div>
            <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= 2 ? 'var(--primary-color)' : '#cbd5e1' }}></div>
            <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= 3 ? 'var(--primary-color)' : '#cbd5e1' }}></div>
          </div>
          <div style={{ width: '80px' }}></div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <SectionHeader title="Paso 1: Destinatario" />
              <div className="input-group" style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '15px', color: '#94a3b8' }} size={20} />
                <input className="input-field" placeholder="Buscar por nombre o CUIL..." style={{ paddingLeft: '48px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', maxHeight: '50vh', overflowY: 'auto', padding: '10px' }}>
                {filteredEmployees.map(emp => (
                  <div key={emp.id} className="card" onClick={() => setSelectedEmployee(emp)}
                    style={{
                      border: selectedEmployee?.id === emp.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: selectedEmployee?.id === emp.id ? 'rgba(39, 194, 184, 0.05)' : '#fff'
                    }}>
                    <div style={{ fontWeight: 800 }}>{emp.lastName}, {emp.firstName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CUIL: {emp.cuil} • Legajo: {emp.legajo}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 40px' }} disabled={!selectedEmployee} onClick={() => setStep(2)}>Siguiente <ChevronRight size={20} /></button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <RiskBadge level={template.risk_level} />
                  <h2 style={{ fontSize: '24px', marginTop: '8px' }}>{template.title}</h2>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>v{template.version}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {template.vars.map(v => (
                  <div className="input-group" key={v.key} style={{ gridColumn: v.type === 'textarea' ? 'span 2' : 'span 1' }}>
                    <label className="input-label" style={{ fontWeight: 800 }}>{v.label} {v.required && '*'}</label>
                    {v.type === 'textarea' ? (
                      <textarea className="input-field" rows="4" value={formData[v.key] || ''} onChange={e => setFormData({ ...formData, [v.key]: e.target.value })} placeholder={v.hint} />
                    ) : v.type === 'select' ? (
                      <select className="input-field" value={formData[v.key] || ''} onChange={e => setFormData({ ...formData, [v.key]: e.target.value })}>
                        <option value="">Seleccionar...</option>
                        {v.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input className="input-field" type={v.type} value={formData[v.key] || ''} onChange={e => setFormData({ ...formData, [v.key]: e.target.value })} placeholder={v.hint} />
                    )}
                    {v.hint && <small style={{ color: 'var(--primary-color)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{v.hint}</small>}
                  </div>
                ))}
              </div>

              <div className="card" style={{ background: '#f8fafc', border: '1px dashed var(--border-color)', marginTop: '24px' }}>
                <h3 style={{ marginBottom: '8px' }}>Base Legal (IA Inspector)</h3>
                {template.legal_basis.map((lib, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', gap: '8px' }}>
                    <ShieldCheck size={14} color="var(--primary-color)" /> {lib.source} {lib.ref}: {lib.text}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => setStep(1)}><ArrowLeft size={20} /> Atrás</button>
                <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 40px' }} onClick={() => setStep(3)}>Vista Previa <ChevronRight size={20} /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <h2>Vista Previa del Documento</h2>
              <div style={{ padding: '40px', background: '#334155', borderRadius: '16px', overflowY: 'auto', maxHeight: '60vh', marginBottom: '24px' }}>
                <div className="pdf-preview" style={{
                  fontFamily: template.isTelegram ? 'Courier, monospace' : "'Times New Roman', serif",
                  textTransform: template.isTelegram ? 'uppercase' : 'none'
                }}>
                  {!template.isTelegram && (
                    <div className="pdf-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #000', paddingBottom: '20px' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '18px' }}>{MOCK_COMPANY.name}</div>
                        <div style={{ fontSize: '12px' }}>CUIT: {MOCK_COMPANY.cuit}</div>
                        <div style={{ fontSize: '12px' }}>{MOCK_COMPANY.address}</div>
                        <div style={{ fontSize: '12px' }}>{MOCK_COMPANY.phone}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800 }}>CONSTANCIA LABORAL</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>ID: DOC-PREVIEW-2024</div>
                      </div>
                    </div>
                  )}

                  <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '30px', textDecoration: 'underline' }}>
                    {template.title}
                  </div>

                  <div className="pdf-body" style={{ whiteSpace: 'pre-line', fontSize: '15px' }}>
                    {renderContent(template.content)}
                  </div>

                  <div style={{ marginTop: '60px', whiteSpace: 'pre-line', fontSize: '14px' }}>
                    {renderContent(template.footer || '')}
                  </div>

                  <div style={{ marginTop: '60px', fontSize: '9px', textAlign: 'center', color: '#999', borderTop: '1px dotted #ccc', paddingTop: '10px' }}>
                    Documento generado mediante LegajoListo v1.1. Emisor: Admin Root. Versión Plantilla: {template.version}.
                    La integridad del documento puede verificarse mediante el ID de trazabilidad digital.
                  </div>
                </div>
              </div>

              {template.warning && (
                <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <AlertTriangle color="#d97706" size={24} />
                  <div style={{ fontSize: '14px', color: '#92400e' }}>
                    <b>ALERTA DE SEGURIDAD LEGAL:</b> {template.warning}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => setStep(2)}>Editar Datos</button>
                <button className="btn btn-primary" onClick={handleFinish}>
                  <FileCheck size={20} /> Emitir Documento Notarizado
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('legajolisto_employees');
    return saved ? JSON.parse(saved) : MOCK_EMPLOYEES;
  });
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('legajolisto_documents');
    return saved ? JSON.parse(saved) : MOCK_DOCUMENTS;
  });
  const [wizardType, setWizardType] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  useEffect(() => {
    localStorage.setItem('legajolisto_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('legajolisto_documents', JSON.stringify(documents));
  }, [documents]);

  const finishWizard = (newDoc) => {
    setDocuments([newDoc, ...documents]);
    setWizardType(null);
    setActiveTab('history');
  };

  return (
    <div className="main-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content-area">
        <div className="container">
          {activeTab === 'home' && <HomeView onStartWizard={setWizardType} />}
          {activeTab === 'employees' && (
            viewingEmployee ? (
              <div className="animate-fade">
                <SectionHeader title="Ficha del Colaborador" showBack onBack={() => setViewingEmployee(null)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                  <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ width: '120px', height: '120px', background: 'var(--primary-color)', borderRadius: '32px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px', fontWeight: 800 }}>
                      {viewingEmployee.firstName[0]}{viewingEmployee.lastName[0]}
                    </div>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{viewingEmployee.lastName.toUpperCase()}, {viewingEmployee.firstName}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '12px' }}>{viewingEmployee.position}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <Badge status="issued" />
                      <Badge status="Admin" />
                    </div>
                  </div>

                  <div className="card">
                    <h3>Información de Legajo</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                      <div><small>LEGAJO</small><br /><b>{viewingEmployee.legajo}</b></div>
                      <div><small>CUIL</small><br /><b>{viewingEmployee.cuil}</b></div>
                      <div><small>DNI</small><br /><b>{viewingEmployee.dni || viewingEmployee.cuil.split('-')[1]}</b></div>
                      <div><small>FECHA INGRESO</small><br /><b>{viewingEmployee.entryDate}</b></div>
                    </div>
                    <h3 style={{ marginTop: '24px' }}>Compliance Documental</h3>
                    {Object.entries(viewingEmployee.checklist).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{key}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div className={`status-light ${value ? 'status-green' : 'status-red'}`}></div>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>{value ? 'Ok' : 'Pendiente'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <EmployeesView
                employees={employees}
                setEmployees={setEmployees}
                onSelectEmployee={setViewingEmployee}
              />
            )
          )}
          {activeTab === 'history' && (
            <div className="animate-fade">
              <SectionHeader title="Auditoría de Documentación" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {documents.map(doc => {
                  const emp = employees.find(e => e.id === doc.employeeId);
                  const template = DOCUMENT_TEMPLATES[doc.type] || { title: doc.type };

                  const handleFileChange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updatedDocs = documents.map(d =>
                          d.id === doc.id ? { ...d, status: 'signed', proof: reader.result } : d
                        );
                        setDocuments(updatedDocs);
                      };
                      reader.readAsDataURL(file);
                    }
                  };

                  return (
                    <div key={doc.id} className="card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <Badge status={doc.status} />
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#cbd5e1' }}>{doc.id}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '18px' }}>{template.title}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                        {emp ? `${emp.lastName}, ${emp.firstName}` : 'Desconocido'} • {doc.date}
                      </div>

                      {doc.proof && (
                        <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img src={doc.proof} alt="Firma" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        <button className="btn-tab" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '12px' }}><Download size={14} /> PDF</button>

                        {!doc.proof && (
                          <label className="btn-tab" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Camera size={14} /> FIRMA
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              style={{ display: 'none' }}
                              onChange={handleFileChange}
                            />
                          </label>
                        )}

                        <button className="btn-tab" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '12px' }}><Share2 size={14} /> ENVIAR</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="animate-fade">
              <SectionHeader title="Configuración" />
              <div className="card">
                <h3>Exportar Backup del Sistema</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Descargá toda tu base de datos (empleados + documentos) en formato JSON para auditorías externas.</p>
                <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => {
                  const data = { employees, documents, company: MOCK_COMPANY };
                  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `backup_legajolisto_${format(new Date(), 'yyyyMMdd')}.json`;
                  a.click();
                }}>
                  <Download size={20} /> Descargar Snapshot Completo
                </button>
              </div>
            </div>
          )}
          {activeTab === 'help' && (
            <div className="animate-fade">
              <SectionHeader title="Centro de Ayuda & Base Legal" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {HELP_ARTICLES.map((art, idx) => (
                  <div key={idx} className="card">
                    <h3 style={{ color: 'var(--primary-color)' }}>{art.title}</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-muted)' }}>{art.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {wizardType && (
        <DocumentWizard
          type={wizardType}
          employees={employees}
          onCancel={() => setWizardType(null)}
          onFinish={finishWizard}
        />
      )}
    </div>
  );
}
