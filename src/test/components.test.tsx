import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CodeBlock } from '../components/common/CodeBlock';
import { BOMTable } from '../components/projects/BOMTable';
import { DifficultyBadge, StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

describe('VoltNex UI Component Rendering & Interactions', () => {
  it('renders CodeBlock with filename, language, line count, and copy button', () => {
    const sampleCode = `#include <Wire.h>\nvoid setup() { Wire.begin(); }\nvoid loop() {}`;
    render(
      <CodeBlock
        code={sampleCode}
        language="cpp"
        filename="i2c_scanner.ino"
      />
    );

    expect(screen.getByText('i2c_scanner.ino')).toBeInTheDocument();
    expect(screen.getByText(/3 lines • CPP/i)).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('renders BOMTable with parts checklist and updates progress on toggle', () => {
    const mockComponents = [
      { name: 'ESP32 NodeMCU', quantity: '1 unit', notes: 'Type-C' },
      { name: 'BME280 Sensor', quantity: '1 unit', notes: 'I2C' },
    ];

    render(<BOMTable components={mockComponents} />);

    expect(screen.getByText('ESP32 NodeMCU')).toBeInTheDocument();
    expect(screen.getByText('BME280 Sensor')).toBeInTheDocument();
    expect(screen.getByText('0 of 2 Acquired')).toBeInTheDocument();

    // Toggle first component item
    const firstRow = screen.getByText('ESP32 NodeMCU').closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
    }

    expect(screen.getByText('1 of 2 Acquired')).toBeInTheDocument();
  });

  it('renders DifficultyBadge with appropriate styling and labels', () => {
    const { rerender } = render(<DifficultyBadge difficulty="Beginner" />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();

    rerender(<DifficultyBadge difficulty="Advanced" />);
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('renders StatusBadge with draft and published states', () => {
    const { rerender } = render(<StatusBadge status="published" />);
    expect(screen.getByText('published')).toBeInTheDocument();

    rerender(<StatusBadge status="draft" />);
    expect(screen.getByText('draft')).toBeInTheDocument();
  });

  it('renders EmptyState with custom title, message, and executes action', () => {
    let clicked = false;
    render(
      <EmptyState
        title="Zero Schematics Found"
        description="Try clearing your filters to see all projects."
        actionText="Reset Filter"
        onAction={() => {
          clicked = true;
        }}
      />
    );

    expect(screen.getByText('Zero Schematics Found')).toBeInTheDocument();
    expect(screen.getByText('Try clearing your filters to see all projects.')).toBeInTheDocument();

    const button = screen.getByText('Reset Filter');
    fireEvent.click(button);
    expect(clicked).toBe(true);
  });
});
