'use client';

import { useField } from '@payloadcms/ui';
import type { TextFieldClientComponent } from 'payload';

const options = [
  ['', 'Belum dikonfirmasi'],
  ['built', 'Built - Selesai dibangun'],
  ['ongoing', 'Ongoing - Sedang dibangun'],
  ['proposed', 'Proposed - Usulan'],
  ['concept', 'Concept - Konsep'],
];

export const ProjectStatusField: TextFieldClientComponent = ({ path, readOnly }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path });
  const current = value || '';
  const legacy = current && !options.some(([key]) => key === current);
  return (
    <div className="field-type text">
      <label className="field-label" htmlFor={`field-${path}`}>Status pembangunan</label>
      <select id={`field-${path}`} value={current} disabled={readOnly} onChange={event => setValue(event.target.value)} style={{ width: '100%', padding: '12px', minHeight: 44 }} aria-describedby={`help-${path}`} aria-invalid={showError}>
        {legacy && <option value={current}>{current} (nilai lama)</option>}
        {options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select>
      <p id={`help-${path}`} className="field-description">Pilih sesuai kondisi proyek. Kosongkan jika belum dikonfirmasi.</p>
      {showError && <p role="alert">{errorMessage}</p>}
    </div>
  );
};
