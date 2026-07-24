#!/usr/bin/env python3
"""
Markdown to PDF Converter
Converte arquivos Markdown em PDF com suporte a CSS customizado,
metadados e auto-instalação de dependências.

Usage:
    python md2pdf.py input.md output.pdf [styles.css]
    python md2pdf.py spec.md spec.pdf osceia-brand.css
"""

import subprocess
import sys
import os
import shutil
from pathlib import Path

class MD2PDF:
    """Gerenciador de conversão Markdown → PDF."""
    
    def __init__(self):
        self.os_type = self._detect_os()
        self.verbose = True
    
    def _detect_os(self):
        """Detecta sistema operacional."""
        if sys.platform == "linux":
            return "linux"
        elif sys.platform == "darwin":
            return "macos"
        elif sys.platform == "win32":
            return "windows"
        return "unknown"
    
    def log(self, msg, level="info"):
        """Imprime mensagens formatadas."""
        if level == "info":
            print(f"ℹ️  {msg}")
        elif level == "success":
            print(f"✓ {msg}")
        elif level == "error":
            print(f"✗ {msg}")
        elif level == "warning":
            print(f"⚠️  {msg}")
    
    def check_command(self, cmd):
        """Verifica se um comando está disponível."""
        return shutil.which(cmd) is not None
    
    def check_dependencies(self):
        """Verifica se Pandoc e WeasyPrint estão instalados."""
        self.log("Verificando dependências...")
        
        # Verificar Pandoc
        if self.check_command("pandoc"):
            self.log("Pandoc encontrado", "success")
        else:
            self.log("Pandoc não encontrado", "error")
            self.install_pandoc()
        
        # Verificar WeasyPrint (Python)
        try:
            import weasyprint
            self.log("WeasyPrint encontrado", "success")
        except ImportError:
            self.log("WeasyPrint não encontrado", "error")
            self.install_weasyprint()
    
    def install_pandoc(self):
        """Instala Pandoc conforme SO."""
        self.log(f"Instalando Pandoc para {self.os_type}...")
        
        try:
            if self.os_type == "linux":
                self._run_command(["sudo", "apt-get", "update"])
                self._run_command(["sudo", "apt-get", "install", "-y", "pandoc"])
            elif self.os_type == "macos":
                self._run_command(["brew", "install", "pandoc"])
            elif self.os_type == "windows":
                self.log(
                    "Windows: Instale manualmente em "
                    "https://github.com/jgm/pandoc/releases",
                    "error"
                )
                sys.exit(1)
            self.log("Pandoc instalado com sucesso", "success")
        except Exception as e:
            self.log(f"Erro ao instalar Pandoc: {e}", "error")
            sys.exit(1)
    
    def install_weasyprint(self):
        """Instala WeasyPrint via pip."""
        self.log("Instalando WeasyPrint...")
        try:
            if self.os_type == "linux":
                # WeasyPrint requer alguns pacotes de sistema no Linux
                self._run_command([
                    "sudo", "apt-get", "install", "-y",
                    "python3-pip", "libcairo2-dev", "libpango-1.0-0",
                    "libpango-cairo-1.0-0", "libgdk-pixbuf2.0-0"
                ])
            self._run_command([sys.executable, "-m", "pip", "install", "weasyprint"])
            self.log("WeasyPrint instalado com sucesso", "success")
        except Exception as e:
            self.log(f"Erro ao instalar WeasyPrint: {e}", "error")
            sys.exit(1)
    
    def _run_command(self, cmd):
        """Executa comando no shell."""
        subprocess.run(cmd, check=True)
    
    def validate_markdown(self, md_file):
        """Valida se o arquivo Markdown existe."""
        if not os.path.exists(md_file):
            self.log(f"Arquivo não encontrado: {md_file}", "error")
            sys.exit(1)
        
        if not md_file.endswith(".md"):
            self.log(f"Aviso: arquivo não termina em .md", "warning")
        
        self.log(f"Arquivo validado: {md_file}", "success")
    
    def validate_css(self, css_file):
        """Valida se o arquivo CSS existe (opcional)."""
        if css_file:
            if not os.path.exists(css_file):
                self.log(f"Arquivo CSS não encontrado: {css_file}", "warning")
                return False
            self.log(f"CSS validado: {css_file}", "success")
            return True
        return False
    
    def convert(self, md_file, pdf_file, css_file=None, metadata=None):
        """Converte Markdown em PDF."""
        # Validar entradas
        self.validate_markdown(md_file)
        css_valid = self.validate_css(css_file)
        
        # Construir comando Pandoc
        cmd = [
            "pandoc",
            md_file,
            "--pdf-engine=weasyprint",
            "-o", pdf_file
        ]
        
        # Adicionar CSS se válido
        if css_valid:
            cmd.extend(["--css", css_file])
        
        # Adicionar metadados
        if metadata:
            for key, value in metadata.items():
                cmd.extend(["--metadata", f"{key}={value}"])
        
        # Executar conversão
        self.log(f"Convertendo: {md_file} → {pdf_file}")
        self.log(f"Comando: {' '.join(cmd)}", "info")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            self.log(f"PDF gerado com sucesso: {pdf_file}", "success")
            
            # Info sobre arquivo gerado
            if os.path.exists(pdf_file):
                size_mb = os.path.getsize(pdf_file) / (1024 * 1024)
                self.log(f"Tamanho: {size_mb:.2f} MB", "info")
            
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Erro na conversão: {e.stderr}", "error")
            sys.exit(1)
    
    def run(self):
        """Executa fluxo completo de conversão."""
        # Parser simples de argumentos
        if len(sys.argv) < 2:
            self.log("Usage: python md2pdf.py <input.md> [output.pdf] [styles.css]", "error")
            sys.exit(1)
        
        md_input = sys.argv[1]
        pdf_output = sys.argv[2] if len(sys.argv) > 2 else md_input.replace(".md", ".pdf")
        css_input = sys.argv[3] if len(sys.argv) > 3 else None
        
        self.log("=== Markdown to PDF Converter ===")
        self.log(f"Sistema Operacional: {self.os_type}")
        
        # Verificar e instalar dependências
        self.check_dependencies()
        
        # Converter
        self.convert(md_input, pdf_output, css_input)

if __name__ == "__main__":
    converter = MD2PDF()
    converter.run()
