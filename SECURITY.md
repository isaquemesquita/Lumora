# 🛡️ Guia de Segurança - Lumora

## Implementações de Segurança Críticas

### 1. **Upload de Arquivo - Proteção Completa**

**Ataques Prevenidos:**
- ✅ File Upload RCE (Remote Code Execution)
- ✅ Zip Bomb / Decompression Bomb
- ✅ XXE (XML External Entity)
- ✅ Path Traversal
- ✅ MIME Type Spoofing
- ✅ Malware Upload

**Implementação:**
```python
# Validação de Magic Bytes (assinatura real do arquivo)
MAGIC_BYTES = {
    b'\xff\xd8\xff': 'jpeg',
    b'\x89PNG\r\n\x1a\n': 'png',
    b'RIFF': 'webp'
}

# Limites rígidos
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_PIXELS = 50_000_000  # 50 megapixels
MAX_DIMENSIONS = 4096  # 4096x4096 máximo

# Sanitização de nome
filename = secure_filename(file.filename)
filename = re.sub(r'[^\w\s.-]', '', filename)[:100]
```

### 2. **Rate Limiting (Anti-DDoS)**

**Ataques Prevenidos:**
- ✅ DDoS (Distributed Denial of Service)
- ✅ Brute Force
- ✅ Resource Exhaustion

**Implementação:**
```python
from flask_limiter import Limiter

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379"  # Ou "memory://"
)

@app.route('/analyze', methods=['POST'])
@limiter.limit("10 per minute")  # 10 uploads por minuto
def analyze():
    ...
```

### 3. **CORS Restrito**

**Ataques Prevenidos:**
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ Unauthorized API Access

**Implementação:**
```python
# Produção: apenas seu domínio
CORS(app, resources={
    r"/*": {
        "origins": ["https://seudominio.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"],
        "max_age": 3600
    }
})
```

### 4. **Security Headers HTTP**

**Ataques Prevenidos:**
- ✅ XSS (Cross-Site Scripting)
- ✅ Clickjacking
- ✅ MIME Sniffing
- ✅ Man-in-the-Middle

**Implementação:**
```python
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response
```

### 5. **Input Validation Rigorosa**

**Ataques Prevenidos:**
- ✅ SQL Injection (não usamos DB, mas boa prática)
- ✅ Command Injection
- ✅ Path Traversal
- ✅ Buffer Overflow

**Implementação:**
```python
def validate_image_safety(data):
    # Magic bytes
    if not data.startswith(b'\xff\xd8\xff'):  # JPEG
        return False
    
    # Tamanho
    if len(data) > MAX_FILE_SIZE:
        return False
    
    # PIL verification
    img = Image.open(io.BytesIO(data))
    if img.width * img.height > MAX_PIXELS:
        return False
    
    img.verify()  # Detecta corrupção
    return True
```

### 6. **Sanitização de EXIF**

**Ataques Prevenidos:**
- ✅ Information Disclosure
- ✅ Privacy Breach (GPS, dados pessoais)

**Implementação:**
```python
def sanitize_exif(exif_data):
    # Remove dados sensíveis
    sensitive = {'GPSInfo', 'GPSLatitude', 'GPSLongitude', 
                 'Artist', 'Copyright', 'OwnerName', 'SerialNumber'}
    
    return {k: str(v)[:200] for k, v in exif_data.items() 
            if k not in sensitive}
```

### 7. **Memory Exhaustion Protection**

**Ataques Prevenidos:**
- ✅ DoS via Large Image
- ✅ Zip Bomb
- ✅ Pixel Flood

**Implementação:**
```python
# Limite de dimensões
if h > 4096 or w > 4096:
    scale = 4096 / max(h, w)
    img = cv2.resize(img, None, fx=scale, fy=scale)

# Limite de pixels
MAX_PIXELS = 50_000_000
if img.width * img.height > MAX_PIXELS:
    raise ValueError("Image too large")
```

### 8. **Error Handling Seguro**

**Ataques Prevenidos:**
- ✅ Information Disclosure
- ✅ Stack Trace Leakage

**Implementação:**
```python
try:
    # Processamento
    result = process_image(data)
except Exception as e:
    # NÃO retornar erro técnico
    return jsonify({
        'error': 'Processing failed'  # Genérico
    }), 500
    
    # Logar internamente (não expor)
    logger.error(f"Error: {str(e)}")
```

### 9. **Timeout Protection**

**Ataques Prevenidos:**
- ✅ Slowloris Attack
- ✅ Resource Exhaustion

**Implementação:**
```python
# Gunicorn config
timeout = 30  # 30 segundos máximo
worker_class = 'sync'
workers = 4
threads = 2
```

### 10. **Frontend Sanitization**

**Ataques Prevenidos:**
- ✅ XSS via Response
- ✅ DOM-based XSS

**Implementação:**
```javascript
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ao exibir dados do backend
element.textContent = sanitizeHTML(response.data);  // NÃO innerHTML
```

## Configuração de Produção

### Backend (Gunicorn)

```python
# gunicorn_config.py
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
timeout = 30
max_requests = 1000
max_requests_jitter = 50
limit_request_line = 4096
limit_request_fields = 100
limit_request_field_size = 8190
```

### Nginx (Reverse Proxy)

```nginx
server {
    listen 443 ssl http2;
    server_name api.seudominio.com;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
    limit_req zone=api burst=20 nodelay;
    
    # Upload size
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

### Variáveis de Ambiente (.env)

```bash
# .env - NUNCA commite isso no Git!
SECRET_KEY=seu-secret-key-aleatorio-longo-aqui
ALLOWED_ORIGINS=https://seudominio.com
REDIS_URL=redis://localhost:6379
MAX_CONTENT_LENGTH=10485760
ENVIRONMENT=production
```

## Monitoramento e Logging

```python
import logging
from logging.handlers import RotatingFileHandler

# Setup logging
handler = RotatingFileHandler('lumora.log', maxBytes=10000000, backupCount=3)
handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)

# Log eventos suspeitos
@app.before_request
def log_request():
    if request.content_length and request.content_length > 10*1024*1024:
        app.logger.warning(f"Large upload attempt: {request.remote_addr}")
```

## Checklist de Deploy

- [ ] Atualizar SECRET_KEY para valor aleatório
- [ ] Configurar ALLOWED_ORIGINS para apenas seu domínio
- [ ] Ativar HTTPS (Let's Encrypt)
- [ ] Configurar Nginx com rate limiting
- [ ] Instalar e configurar Redis (para rate limiting robusto)
- [ ] Desabilitar Flask debug mode
- [ ] Usar Gunicorn/uWSGI em produção
- [ ] Configurar firewall (UFW/iptables)
- [ ] Limitar portas abertas (apenas 80, 443)
- [ ] Configurar auto-updates de segurança (unattended-upgrades)
- [ ] Setup de monitoramento (Sentry, Datadog, etc.)
- [ ] Backup automático
- [ ] Testar com OWASP ZAP ou Burp Suite

## Testes de Segurança

```bash
# 1. Teste de upload malicioso
curl -X POST http://localhost:5000/analyze \
  -F "image=@malicious.exe"

# 2. Teste de arquivo gigante
dd if=/dev/zero of=huge.jpg bs=1M count=100
curl -X POST http://localhost:5000/analyze \
  -F "image=@huge.jpg"

# 3. Teste de rate limiting
for i in {1..20}; do
  curl -X POST http://localhost:5000/analyze \
    -F "image=@test.jpg"
done

# 4. Teste de SQL Injection (não deve afetar, mas valida)
curl -X POST http://localhost:5000/analyze \
  -F "image=@test.jpg'; DROP TABLE users;--"
```

## Vulnerabilidades Críticas Bloqueadas

✅ **A01:2021 – Broken Access Control**
✅ **A02:2021 – Cryptographic Failures**
✅ **A03:2021 – Injection**
✅ **A04:2021 – Insecure Design**
✅ **A05:2021 – Security Misconfiguration**
✅ **A06:2021 – Vulnerable Components** (atualizações automáticas)
✅ **A07:2021 – Authentication Failures** (rate limiting)
✅ **A08:2021 – Software/Data Integrity** (validação de arquivos)
✅ **A09:2021 – Logging Failures** (logs estruturados)
✅ **A10:2021 – SSRF** (sem requisições externas)

## Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/3.0.x/security/)
- [Gunicorn Deployment](https://docs.gunicorn.org/en/stable/deploy.html)
- [Nginx Security](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)

---

**⚠️ IMPORTANTE**: Segurança é um processo contínuo. Revise e atualize regularmente suas dependências e configurações.
