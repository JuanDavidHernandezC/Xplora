from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Datos actualizados sin reservas
EXPERIENCIAS = [
    {
        'id': 1,
        'titulo': 'Ruta Gastronómica Chía',
        'descripcion': 'Descubre los sabores auténticos de la región en un tour culinario único',
        'municipio': 'Chía',
        'categoria': 'gastronomia',
        'imagen': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        'rating': 4.8,
        'duracion': '4 horas',
        'recomendaciones': ['Llevar ropa cómoda', 'Ideal para foodies', 'Fotos permitidas'],
        'emprendedor': 'Doña María Restaurante'
    },
    {
        'id': 2,
        'titulo': 'Senderos Ecológicos Tabio',
        'descripcion': 'Caminata guiada por paisajes naturales únicos y cascadas escondidas',
        'municipio': 'Tabio',
        'categoria': 'ecoturismo',
        'imagen': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'rating': 4.9,
        'duracion': '3 horas',
        'recomendaciones': ['Zapatos cómodos', 'Hidratación incluida', 'Guía certificado'],
        'emprendedor': 'EcoAventuras Tabio'
    },
    {
        'id': 3,
        'titulo': 'Tour Cultural Cajicá',
        'descripcion': 'Recorrido histórico por el patrimonio colonial y tradiciones locales',
        'municipio': 'Cajicá',
        'categoria': 'cultura',
        'imagen': 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=400&h=300&fit=crop',
        'rating': 4.7,
        'duracion': '5 horas',
        'recomendaciones': ['Apto para todas las edades', 'Incluye entradas', 'Guía bilingüe'],
        'emprendedor': 'Cultura Viva Cajicá'
    },
    {
        'id': 4,
        'titulo': 'Taller de Artesanías Locales',
        'descripcion': 'Aprende técnicas tradicionales de artesanía con maestros locales',
        'municipio': 'Chía',
        'categoria': 'artesania',
        'imagen': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        'rating': 4.6,
        'duracion': '3 horas',
        'recomendaciones': ['Materiales incluidos', 'Puedes llevar tu creación', 'Apto para niños'],
        'emprendedor': 'Artesanías Tradicionales'
    }
]

EMPRENDEDORES = [
    {
        'id': 1,
        'nombre': 'Doña María González',
        'categoria': 'Gastronomía',
        'descripcion': 'Especialista en comida tradicional chia con 20 años de experiencia',
        'imagen': 'https://generalcargo.net/wp-content/uploads/2023/04/AdobeStock_565116699-scaled.jpeg',
        'rating': 4.9,
        'municipio': 'Chía',
        'experiencias': [1]
    },
    {
        'id': 2,
        'nombre': 'Carlos Rodríguez',
        'categoria': 'Ecoturismo',
        'descripcion': 'Guía certificado con amplio conocimiento de los senderos de Tabio',
        'imagen': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'rating': 4.8,
        'municipio': 'Tabio',
        'experiencias': [2]
    },
    {
        'id': 3,
        'nombre': 'Ana Martínez',
        'categoria': 'Artesanías',
        'descripcion': 'Artesana especializada en tejidos tradicionales y productos hechos a mano',
        'imagen': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        'rating': 4.7,
        'municipio': 'Cajicá',
        'experiencias': [4]
    }
]

MUNICIPIOS = {
    'chia': {
        'nombre': 'Chía',
        'descripcion': 'Capital de la Luna, donde la tradición se encuentra con la modernidad',
        'imagen': 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=400&h=300&fit=crop',
        'experiencias': [1, 4]
    },
    'tabio': {
        'nombre': 'Tabio',
        'descripcion': 'Tierra de aguas termales y paisajes campestres rejuvenecedores',
        'imagen': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop',
        'experiencias': [2]
    },
    'cajica': {
        'nombre': 'Cajicá',
        'descripcion': 'Pueblo colonial lleno de historia, cultura y tradiciones vivas',
        'imagen': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop',
        'experiencias': [3]
    }
}

@app.route('/')
def index():
    return render_template('index.html', experiencias=EXPERIENCIAS, municipios=MUNICIPIOS)

# RUTAS MÓVILES - CON ENDPOINTS ÚNICOS
@app.route('/mobile')
def mobile_home():
    return render_template('mobile.html', experiencias=EXPERIENCIAS[:3])

@app.route('/mobile/mapas')
def mobile_mapas():
    return render_template('mapas.html', municipios=MUNICIPIOS)

@app.route('/mobile/guardados')
def mobile_guardados():
    return render_template('guardados.html', experiencias=EXPERIENCIAS[:2])

@app.route('/mobile/perfil')
def mobile_perfil():
    return render_template('perfil.html')

@app.route('/mobile/experiencia/<int:id>')
def mobile_experiencia_detalle(id):
    experiencia = next((exp for exp in EXPERIENCIAS if exp['id'] == id), None)
    return render_template('experiencia-detalle.html', experiencia=experiencia)

@app.route('/mobile/emprendedores')
def mobile_emprendedores():
    return render_template('emprendedores.html', emprendedores=EMPRENDEDORES, experiencias=EXPERIENCIAS)

# APIs
@app.route('/api/experiencias')
def api_experiencias():
    return jsonify(EXPERIENCIAS)

@app.route('/api/experiencias/<categoria>')
def api_experiencias_categoria(categoria):
    filtradas = [exp for exp in EXPERIENCIAS if exp['categoria'] == categoria]
    return jsonify(filtradas)

@app.route('/api/emprendedores')
def api_emprendedores():
    return jsonify(EMPRENDEDORES)

if __name__ == '__main__':
    app.run(debug=True, port=5000)