#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lumora Backend - Detector Avançado de Imagens IA com ML"""

from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
import numpy as np
import cv2
from PIL import Image, ExifTags
from scipy import fft, stats
import io
import re
import os
import secrets
import hashlib

app = Flask(__name__)

# SEGURANÇA 1: Configurações Flask
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB máximo
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['JSON_SORT_KEYS'] = False

# SEGURANÇA 2: CORS restrito (ajustar em produção)
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')
CORS(app, resources={
    r"/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "max_age": 3600
    }
})

# SEGURANÇA 3: Whitelist de tipos permitidos
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'}
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'}

# SEGURANÇA 4: Magic bytes para validação real
MAGIC_BYTES = {
    b'\xff\xd8\xff': 'jpeg',
    b'\x89PNG\r\n\x1a\n': 'png',
    b'GIF87a': 'gif',
    b'GIF89a': 'gif',
    b'RIFF': 'webp',
    b'BM': 'bmp'
}

def validate_file_signature(data):
    """Valida assinatura de arquivo (previne spoofing)"""
    for magic in MAGIC_BYTES.keys():
        if data.startswith(magic):
            return True
    return False

def sanitize_filename(filename):
    """Sanitiza nome de arquivo (previne path traversal)"""
    if not filename:
        return 'unknown'
    filename = secure_filename(filename)
    filename = re.sub(r'[^\w\s.-]', '', filename)
    return filename[:100]

def validate_image_safety(data):
    """Validações de segurança em imagens"""
    try:
        if not validate_file_signature(data):
            return False, "Assinatura de arquivo inválida"
        
        img = Image.open(io.BytesIO(data))
        
        # SEGURANÇA 5: Limites de dimensão (previne memory exhaustion)
        MAX_PIXELS = 50_000_000
        if img.width * img.height > MAX_PIXELS:
            return False, "Imagem muito grande"
        
        img.verify()
        img = Image.open(io.BytesIO(data))
        
        if img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')
        
        return True, "OK"
    except Exception as e:
        return False, f"Imagem inválida"

@app.after_request
def add_security_headers(response):
    """SEGURANÇA 6: Headers HTTP de segurança"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

class AIImageDetector:
    """Detector avançado com 12+ técnicas de análise"""
    
    def __init__(self):
        self.weights = {
            'filename': 180, 'exif': 120, 'frequency_analysis': 100,
            'gan_artifacts': 95, 'unnatural_sharpness': 90, 'jpeg_grid': 85,
            'noise_consistency': 80, 'color_distribution': 75, 'gradient_analysis': 70,
            'chromatic_aberration': 65, 'edge_coherence': 60, 'saturation_analysis': 55
        }
    
    def analyze_image(self, image_data, filename, file_size):
        """Análise completa com proteções de segurança"""
        findings = []
        scores = {'ai': 0, 'real': 0}
        confidence = 0
        
        try:
            # SEGURANÇA 7: Limita tamanho
            if file_size > 10 * 1024 * 1024:
                raise ValueError("Arquivo muito grande")
            
            # Carregar e validar imagem
            img_array = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Falha ao decodificar")
            
            # SEGURANÇA 8: Limita dimensões
            max_dim = 4096
            h, w = img.shape[:2]
            if h > max_dim or w > max_dim:
                scale = max_dim / max(h, w)
                new_h, new_w = int(h * scale), int(w * scale)
                img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            exif_data = self._extract_exif(image_data)
            
            # Executar todas as análises
            analyses = [
                self._analyze_filename(filename),
                self._analyze_exif(exif_data),
                self._frequency_analysis(img),
                self._detect_gan_artifacts(img),
                self._analyze_sharpness(img),
                self._analyze_jpeg_grid(img),
                self._analyze_noise_consistency(img),
                self._analyze_color_distribution(img_rgb),
                self._analyze_gradients(img),
                self._analyze_chromatic_aberration(img),
                self._analyze_edge_coherence(img),
                self._analyze_saturation(img_rgb)
            ]
            
            # Processar resultados
            for result in analyses:
                if result:
                    findings.append(result)
                    scores[result['impact']] += result['weight']
                    confidence += result.get('confidence_boost', 15)
            
            # Calcular resultado final
            total = scores['ai'] + scores['real']
            ai_probability = (scores['ai'] / total * 100) if total > 0 else 50
            confidence = min(100, confidence)
            
            return {
                'findings': findings,
                'scores': scores,
                'confidence': confidence,
                'aiProbability': ai_probability,
                'exif': self._sanitize_exif(exif_data)
            }
            
        except Exception as e:
            # SEGURANÇA 9: Não vazar informações do sistema
            return {
                'findings': [{
                    'type': 'error',
                    'icon': '❌',
                    'title': 'Erro no processamento',
                    'explain': 'Não foi possível analisar esta imagem.',
                    'impact': 'error',
                    'weight': 0
                }],
                'scores': {'ai': 0, 'real': 0},
                'confidence': 0,
                'aiProbability': 50,
                'exif': {}
            }
    
    def _sanitize_exif(self, exif_data):
        """SEGURANÇA 10: Remove dados sensíveis do EXIF"""
        if not exif_data:
            return {}
        
        sensitive_keys = {'GPSInfo', 'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 
                         'Artist', 'Copyright', 'OwnerName', 'SerialNumber'}
        
        sanitized = {}
        for key, value in exif_data.items():
            if key not in sensitive_keys:
                if isinstance(value, str):
                    sanitized[key] = value[:200]
                else:
                    sanitized[key] = str(value)[:200]
        
        return sanitized
    
    def _extract_exif(self, image_data):
        """Extrair metadados EXIF"""
        try:
            img = Image.open(io.BytesIO(image_data))
            exif_data = {}
            if hasattr(img, '_getexif') and img._getexif():
                exif = img._getexif()
                for tag_id, value in exif.items():
                    tag = ExifTags.TAGS.get(tag_id, tag_id)
                    exif_data[tag] = str(value)
            return exif_data
        except:
            return {}
    
    def _analyze_filename(self, filename):
        """Análise crítica do nome do arquivo"""
        fn = filename.lower()
        critical = ['chatgpt', 'gpt', 'dalle', 'dall-e', 'midjourney', 'stablediffusion', 
                   'stable-diffusion', 'leonardo', 'firefly']
        
        for keyword in critical:
            if keyword in fn:
                return {
                    'type': 'critical', 'icon': '🚨',
                    'title': f'Nome contém "{keyword.upper()}"',
                    'explain': 'Nome indica claramente origem de IA. Geradores adicionam suas marcas.',
                    'impact': 'ai', 'weight': self.weights['filename'], 'confidence_boost': 30
                }
        
        patterns = [(r'_ai_', 'AI'), (r'generated', 'Generated'), (r'output_\d+', 'Output')]
        for pattern, desc in patterns:
            if re.search(pattern, fn):
                return {
                    'type': 'high', 'icon': '⚠️', 'title': f'Padrão "{desc}" detectado',
                    'explain': 'Nomenclatura típica de geração automatizada.',
                    'impact': 'ai', 'weight': int(self.weights['filename'] * 0.6), 'confidence_boost': 20
                }
        return None
    
    def _analyze_exif(self, exif_data):
        """Análise de metadados EXIF"""
        if not exif_data:
            return {
                'type': 'warning', 'icon': '⚠️', 'title': 'Sem metadados EXIF',
                'explain': 'IA geralmente não possui dados de câmera.',
                'impact': 'ai', 'weight': int(self.weights['exif'] * 0.4), 'confidence_boost': 15
            }
        
        has_camera = 'Make' in exif_data or 'Model' in exif_data
        has_exposure = any(k in exif_data for k in ['ExposureTime', 'FNumber', 'ISOSpeedRatings', 'ISO'])
        
        if has_camera and has_exposure:
            camera = f"{exif_data.get('Make', '')} {exif_data.get('Model', '')}".strip()
            return {
                'type': 'good', 'icon': '📸', 'title': 'Metadados de câmera genuínos',
                'explain': f'Dados de câmera real: {camera}',
                'impact': 'real', 'weight': self.weights['exif'], 'confidence_boost': 25
            }
        return None
    
    def _frequency_analysis(self, img):
        """Análise de frequência DFT"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        if max(gray.shape) > 512:
            scale = 512 / max(gray.shape)
            gray = cv2.resize(gray, None, fx=scale, fy=scale)
        
        dft = cv2.dft(np.float32(gray), flags=cv2.DFT_COMPLEX_OUTPUT)
        dft_shift = np.fft.fftshift(dft)
        magnitude = np.log(cv2.magnitude(dft_shift[:,:,0], dft_shift[:,:,1]) + 1)
        
        center_h, center_w = magnitude.shape[0] // 2, magnitude.shape[1] // 2
        low_freq = magnitude[center_h-30:center_h+30, center_w-30:center_w+30]
        high_freq = np.concatenate([magnitude[0:30, :], magnitude[-30:, :]])
        
        ratio = np.mean(low_freq) / (np.mean(high_freq) + 1e-10)
        
        if ratio > 15:
            return {
                'type': 'high', 'icon': '📊', 'title': 'Espectro artificial',
                'explain': f'Excesso de baixas frequências (ratio: {ratio:.1f}). IA é artificialmente lisa.',
                'impact': 'ai', 'weight': self.weights['frequency_analysis'], 'confidence_boost': 25
            }
        elif ratio < 5:
            return {
                'type': 'good', 'icon': '📈', 'title': 'Distribuição natural de frequências',
                'explain': f'Equilíbrio natural (ratio: {ratio:.1f}). Típico de fotos reais.',
                'impact': 'real', 'weight': int(self.weights['frequency_analysis'] * 0.85), 'confidence_boost': 25
            }
        return None
    
    def _detect_gan_artifacts(self, img):
        """Detectar artefatos de GANs"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        block_size = 16
        h, w = gray.shape
        
        block_vars = []
        for y in range(0, h - block_size, block_size):
            for x in range(0, w - block_size, block_size):
                block = gray[y:y+block_size, x:x+block_size]
                block_vars.append(np.var(block))
        
        if not block_vars:
            return None
        
        var_of_vars = np.var(block_vars)
        mean_var = np.mean(block_vars)
        
        if var_of_vars < 500 and mean_var < 100:
            return {
                'type': 'high', 'icon': '🤖', 'title': 'Artefatos GAN',
                'explain': 'Blocos uniformes típicos de redes neurais. Forte indicador de IA.',
                'impact': 'ai', 'weight': self.weights['gan_artifacts'], 'confidence_boost': 25
            }
        elif var_of_vars > 2000:
            return {
                'type': 'good', 'icon': '✓', 'title': 'Variação natural',
                'explain': 'Distribuição irregular típica de fotos reais.',
                'impact': 'real', 'weight': int(self.weights['gan_artifacts'] * 0.75), 'confidence_boost': 20
            }
        return None
    
    def _analyze_sharpness(self, img):
        """Nitidez artificial vs natural"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = laplacian.var()
        
        lap_hist, _ = np.histogram(laplacian.flatten(), bins=50)
        lap_entropy = stats.entropy(lap_hist + 1)
        
        if sharpness > 1500 and lap_entropy < 2.5:
            return {
                'type': 'high', 'icon': '🔍', 'title': 'Nitidez artificial',
                'explain': 'Nitidez muito uniforme. Câmeras reais têm variação focal.',
                'impact': 'ai', 'weight': self.weights['unnatural_sharpness'], 'confidence_boost': 20
            }
        elif 200 < sharpness < 800 and lap_entropy > 3.0:
            return {
                'type': 'good', 'icon': '🎯', 'title': 'Nitidez natural',
                'explain': 'Variação natural de foco típica de câmeras.',
                'impact': 'real', 'weight': int(self.weights['unnatural_sharpness'] * 0.7), 'confidence_boost': 20
            }
        return None
    
    def _analyze_jpeg_grid(self, img):
        """Padrões de grade JPEG"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape
        
        block_edges = []
        for y in range(8, h-8, 8):
            diff = np.abs(gray[y, :].astype(float) - gray[y-1, :].astype(float))
            block_edges.append(np.mean(diff))
        
        if not block_edges:
            return None
        
        avg_edge = np.mean(block_edges)
        
        if avg_edge > 3.0:
            return {
                'type': 'good', 'icon': '🔲', 'title': 'Artefatos JPEG',
                'explain': 'Grade 8x8 de compressão JPEG. Típico de fotos reais.',
                'impact': 'real', 'weight': int(self.weights['jpeg_grid'] * 0.8), 'confidence_boost': 20
            }
        elif avg_edge < 0.5:
            return {
                'type': 'warning', 'icon': '⚡', 'title': 'Sem artefatos JPEG',
                'explain': 'Falta de compressão JPEG pode indicar IA.',
                'impact': 'ai', 'weight': int(self.weights['jpeg_grid'] * 0.6), 'confidence_boost': 15
            }
        return None
    
    def _analyze_noise_consistency(self, img):
        """Consistência de ruído"""
        h, w = img.shape[:2]
        regions = [img[0:h//2, 0:w//2], img[0:h//2, w//2:w], 
                  img[h//2:h, 0:w//2], img[h//2:h, w//2:w]]
        
        noise_levels = []
        for region in regions:
            gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
            noise = cv2.Laplacian(gray, cv2.CV_64F).std()
            noise_levels.append(noise)
        
        noise_std = np.std(noise_levels)
        noise_mean = np.mean(noise_levels)
        
        if noise_std < 1.0 and noise_mean < 5.0:
            return {
                'type': 'high', 'icon': '🎭', 'title': 'Ruído artificial uniforme',
                'explain': 'Ruído muito consistente. IA gera ruído sintético.',
                'impact': 'ai', 'weight': self.weights['noise_consistency'], 'confidence_boost': 20
            }
        elif noise_std > 3.0 and noise_mean > 8.0:
            return {
                'type': 'good', 'icon': '📷', 'title': 'Ruído natural de sensor',
                'explain': 'Variação típica de sensores reais.',
                'impact': 'real', 'weight': int(self.weights['noise_consistency'] * 0.8), 'confidence_boost': 20
            }
        return None
    
    def _analyze_color_distribution(self, img_rgb):
        """Distribuição e correlação de cores"""
        # Amostragem para performance
        h, w = img_rgb.shape[:2]
        sample_size = min(10000, h * w)
        indices = np.random.choice(h * w, sample_size, replace=False)
        
        r_flat = img_rgb[:,:,0].flatten()[indices]
        g_flat = img_rgb[:,:,1].flatten()[indices]
        b_flat = img_rgb[:,:,2].flatten()[indices]
        
        corr_rg = np.corrcoef(r_flat, g_flat)[0, 1]
        corr_rb = np.corrcoef(r_flat, b_flat)[0, 1]
        corr_gb = np.corrcoef(g_flat, b_flat)[0, 1]
        avg_corr = (corr_rg + corr_rb + corr_gb) / 3
        
        hist_r = cv2.calcHist([img_rgb], [0], None, [256], [0, 256])
        entropy_r = stats.entropy(hist_r.flatten() + 1)
        
        if avg_corr > 0.95 and entropy_r < 6.0:
            return {
                'type': 'high', 'icon': '🎨', 'title': 'Cores artificialmente correlacionadas',
                'explain': 'Canais muito sincronizados. IA gera cores harmônicas demais.',
                'impact': 'ai', 'weight': self.weights['color_distribution'], 'confidence_boost': 20
            }
        elif avg_corr < 0.75 and entropy_r > 7.0:
            return {
                'type': 'good', 'icon': '🌈', 'title': 'Distribuição natural',
                'explain': 'Canais independentes típicos de cenas reais.',
                'impact': 'real', 'weight': int(self.weights['color_distribution'] * 0.75), 'confidence_boost': 15
            }
        return None
    
    def _analyze_gradients(self, img):
        """Análise de gradientes"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        gradient_mag = np.sqrt(sobelx**2 + sobely**2)
        
        grad_std = np.std(gradient_mag)
        grad_hist, _ = np.histogram(gradient_mag.flatten(), bins=50)
        grad_entropy = stats.entropy(grad_hist + 1)
        
        if grad_std < 10 and grad_entropy < 3.0:
            return {
                'type': 'warning', 'icon': '📉', 'title': 'Gradientes suaves',
                'explain': 'Transições muito uniformes. Pode indicar IA.',
                'impact': 'ai', 'weight': self.weights['gradient_analysis'], 'confidence_boost': 15
            }
        elif grad_std > 30 and grad_entropy > 4.0:
            return {
                'type': 'good', 'icon': '📊', 'title': 'Gradientes complexos',
                'explain': 'Transições complexas de cenas reais.',
                'impact': 'real', 'weight': int(self.weights['gradient_analysis'] * 0.7), 'confidence_boost': 15
            }
        return None
    
    def _analyze_chromatic_aberration(self, img):
        """Aberração cromática de lentes"""
        b, g, r = cv2.split(img)
        edges_r = cv2.Canny(r, 50, 150)
        edges_g = cv2.Canny(g, 50, 150)
        edges_b = cv2.Canny(b, 50, 150)
        
        diff_rg = np.abs(edges_r.astype(float) - edges_g.astype(float))
        diff_rb = np.abs(edges_r.astype(float) - edges_b.astype(float))
        avg_aberration = (np.mean(diff_rg) + np.mean(diff_rb)) / 2
        
        if avg_aberration > 2.0:
            return {
                'type': 'good', 'icon': '🔬', 'title': 'Aberração cromática',
                'explain': 'Desalinhamento natural de lentes reais.',
                'impact': 'real', 'weight': self.weights['chromatic_aberration'], 'confidence_boost': 15
            }
        elif avg_aberration < 0.5:
            return {
                'type': 'warning', 'icon': '⚙️', 'title': 'Perfeição cromática',
                'explain': 'Canais perfeitamente alinhados. Raro em fotos reais.',
                'impact': 'ai', 'weight': int(self.weights['chromatic_aberration'] * 0.6), 'confidence_boost': 12
            }
        return None
    
    def _analyze_edge_coherence(self, img):
        """Coerência de bordas"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(edges, 8)
        
        sizes = stats[1:, cv2.CC_STAT_AREA]
        if len(sizes) == 0:
            return None
        
        avg_size = np.mean(sizes)
        size_std = np.std(sizes)
        
        if size_std < 5 and avg_size < 10:
            return {
                'type': 'warning', 'icon': '🧩', 'title': 'Bordas fragmentadas',
                'explain': 'Bordas desconectadas. Típico de artefatos.',
                'impact': 'ai', 'weight': self.weights['edge_coherence'], 'confidence_boost': 12
            }
        elif size_std > 50 and avg_size > 30:
            return {
                'type': 'good', 'icon': '🖼️', 'title': 'Estrutura natural',
                'explain': 'Bordas conectadas naturalmente.',
                'impact': 'real', 'weight': int(self.weights['edge_coherence'] * 0.7), 'confidence_boost': 12
            }
        return None
    
    def _analyze_saturation(self, img_rgb):
        """Análise de saturação"""
        hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)
        saturation = hsv[:,:,1]
        
        sat_mean = np.mean(saturation)
        sat_std = np.std(saturation)
        
        if sat_mean > 180 and sat_std < 30:
            return {
                'type': 'warning', 'icon': '🎨', 'title': 'Saturação alta',
                'explain': 'Cores muito saturadas. IA gera cores vibrantes demais.',
                'impact': 'ai', 'weight': self.weights['saturation_analysis'], 'confidence_boost': 10
            }
        elif 80 < sat_mean < 150 and sat_std > 40:
            return {
                'type': 'good', 'icon': '🎬', 'title': 'Saturação natural',
                'explain': 'Distribuição natural de fotos reais.',
                'impact': 'real', 'weight': int(self.weights['saturation_analysis'] * 0.6), 'confidence_boost': 10
            }
        return None

# Instância global
detector = AIImageDetector()

@app.route('/analyze', methods=['POST'])
def analyze():
    """Endpoint de análise com validações de segurança"""
    try:
        # Validação 1: Arquivo presente
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        # Validação 2: Nome de arquivo
        if not file.filename:
            return jsonify({'error': 'No filename'}), 400
        
        filename = sanitize_filename(file.filename)
        
        # Validação 3: Extensão
        ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
        if ext not in ALLOWED_EXTENSIONS:
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Validação 4: Conteúdo
        image_data = file.read()
        file_size = len(image_data)
        
        # Validação 5: Tamanho
        if file_size > 10 * 1024 * 1024:
            return jsonify({'error': 'File too large'}), 413
        
        if file_size < 100:
            return jsonify({'error': 'File too small'}), 400
        
        # Validação 6: MIME type
        file_type = file.content_type
        if file_type not in ALLOWED_MIME_TYPES:
            return jsonify({'error': 'Invalid MIME type'}), 400
        
        # Validação 7: Segurança da imagem
        is_safe, message = validate_image_safety(image_data)
        if not is_safe:
            return jsonify({'error': message}), 400
        
        # Processar
        result = detector.analyze_image(image_data, filename, file_size)
        return jsonify(result)
    
    except Exception as e:
        # SEGURANÇA 11: Erro genérico (não vazar stack trace)
        return jsonify({'error': 'Processing failed'}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'healthy', 'version': '3.3'})

if __name__ == '__main__':
    print("🛡️ Lumora Backend v3.3 - Detector Avançado de IA [SECURE]")
    print("Servidor rodando em http://localhost:5000")
    print("")
    print("⚠️  ATENÇÃO: Modo DEBUG ativo (apenas para desenvolvimento)")
    print("   Em produção, use: gunicorn backend:app -w 4 -b 0.0.0.0:5000")
    print("")
    app.run(debug=True, host='0.0.0.0', port=5000)
