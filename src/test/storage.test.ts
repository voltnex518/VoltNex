import { describe, it, expect } from 'vitest';
import {
  validateUploadFile,
  MAX_MEDIA_FILE_SIZE,
  ALLOWED_IMAGE_EXTENSIONS,
} from '../lib/storage';

describe('Storage & File Upload Security Validation', () => {
  it('accepts valid electronics schematics and image formats', () => {
    ALLOWED_IMAGE_EXTENSIONS.forEach((ext) => {
      const mockFile = new File(['mock content'], `circuit_board.${ext}`, {
        type: ext === 'png' ? 'image/png' : 'image/jpeg',
      });
      const result = validateUploadFile(mockFile, 'media');
      expect(result.isValid).toBe(true);
      expect(result.extension).toBe(ext);
    });
  });

  it('rejects disallowed media file extensions and executable files', () => {
    const maliciousFiles = [
      'firmware_exploit.exe',
      'backdoor.bat',
      'malicious_script.sh',
      'shell.php',
      'payload.js',
    ];

    maliciousFiles.forEach((fileName) => {
      const mockFile = new File(['content'], fileName, { type: 'application/octet-stream' });
      const resultMedia = validateUploadFile(mockFile, 'media');
      const resultDownload = validateUploadFile(mockFile, 'download');
      expect(resultMedia.isValid).toBe(false);
      expect(resultDownload.isValid).toBe(false);
    });
  });

  it('accepts valid embedded source code, firmware, CAD and PDF files', () => {
    const validHardwareFiles = [
      'esp32_firmware.ino',
      'sensor_driver.cpp',
      'motor_control.c',
      'telemetry.py',
      'kicad_project.zip',
      'pinout_sheet.pdf',
    ];

    validHardwareFiles.forEach((fileName) => {
      const mockFile = new File(['firmware code'], fileName, { type: 'text/plain' });
      const result = validateUploadFile(mockFile, 'download');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedName).toBeDefined();
    });
  });

  it('enforces maximum file size limits for media (10MB)', () => {
    // 11MB file
    const oversizedBlob = new Uint8Array(MAX_MEDIA_FILE_SIZE + 1024 * 1024);
    const oversizedFile = new File([oversizedBlob], 'huge_schematic.png', { type: 'image/png' });
    const result = validateUploadFile(oversizedFile, 'media');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('maximum allowed size of 10MB');
  });

  it('sanitizes unsafe characters and directory traversal attempts from filenames', () => {
    const fileWithTraversal = new File(['code'], '../../secret/hack#$<>.ino', { type: 'text/plain' });
    const result = validateUploadFile(fileWithTraversal, 'download');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedName).not.toContain('..');
    expect(result.sanitizedName).not.toContain('/');
    expect(result.sanitizedName).not.toContain('#');
  });
});
