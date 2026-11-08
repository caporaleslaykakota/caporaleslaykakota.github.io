import os
from PIL import Image

class ImageOptimizer:
    """
    Clase para analizar y transformar imágenes (PNG, JPEG, JPG) de la carpeta actual
    a formato WebP, generando una versión principal optimizada y un thumbnail,
    preservando la transparencia cuando el formato original lo contenga.
    """
    def __init__(self, main_max_size=(1600, 1600), thumb_max_size=(560, 560), main_quality=80, thumb_quality=75):
        self.supported_extensions = ('.png', '.jpeg', '.jpg')
        self.main_max_size = main_max_size
        self.thumb_max_size = thumb_max_size
        self.main_quality = main_quality
        self.thumb_quality = thumb_quality

    def process_folder(self, target_dir=None):
        """
        Escanea la carpeta indicada (por defecto donde se ejecuta el script)
        y procesa todas las imágenes compatibles encontradas.
        """
        if target_dir is None:
            target_dir = os.getcwd()

        print(f"[*] Analizando directorio: {target_dir}")
        
        files = os.listdir(target_dir)
        processed_count = 0

        for filename in files:
            # Validar extensión y evitar procesar archivos que ya sean thumbnails
            if filename.lower().endswith(self.supported_extensions) and not "-thumb" in filename.lower():
                input_path = os.path.join(target_dir, filename)
                base_name, _ = os.path.splitext(filename)
                
                try:
                    self._convert_image(input_path, target_dir, base_name)
                    processed_count += 1
                except Exception as e:
                    print(f"[!] Error procesando {filename}: {e}")

        print(f"\n[✔] Proceso finalizado. Total de imágenes convertidas: {processed_count}")

    def _convert_image(self, input_path, output_dir, base_name):
        """Abre una imagen y genera la versión principal y el thumbnail en WebP preservando la transparencia."""
        with Image.open(input_path) as img:
            # Manejo inteligente del modo de color para conservar transparencia (RGBA)
            if img.mode == "P":
                img = img.convert("RGBA")
            elif img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGB")

            # 1. Generar versión principal en WebP
            main_filename = f"{base_name}.webp"
            main_path = os.path.join(output_dir, main_filename)
            
            img_main = img.copy()
            img_main.thumbnail(self.main_max_size, Image.Resampling.LANCZOS)
            img_main.save(main_path, "WEBP", quality=self.main_quality, method=6)
            print(f"    -> Creado principal: {main_filename}")

            # 2. Generar versión thumbnail con el sufijo requerido
            thumb_filename = f"{base_name}-thumb.webp"
            thumb_path = os.path.join(output_dir, thumb_filename)
            
            img_thumb = img.copy()
            img_thumb.thumbnail(self.thumb_max_size, Image.Resampling.LANCZOS)
            img_thumb.save(thumb_path, "WEBP", quality=self.thumb_quality, method=6)
            print(f"    -> Creado thumbnail: {thumb_filename}")

if __name__ == "__main__":
    # Obtiene la ruta exacta donde se encuentra este archivo .py
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    optimizer = ImageOptimizer()
    # Le pasamos la carpeta del script (o puedes cambiarla por la ruta de tus imágenes raw)
    optimizer.process_folder(target_dir=script_dir)