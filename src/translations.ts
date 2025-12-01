export const translations = {
  es: {
    // Header
    appTitle: 'TrashIA',
    appSubtitle: 'Clasificador Inteligente de Residuos',
    
    // Upload Section
    dragImageHere: 'Arrastra tu imagen aquí',
    orClickToSelect: 'o haz clic para seleccionar',
    fileRequirements: 'Solo JPEG o PNG • Máximo 5MB',
    selectImage: 'Seleccionar Imagen',
    takePhoto: 'Tomar Foto',
    
    // Camera Section
    cameraActive: 'Cámara Activa - Posiciona el objeto',
    cameraInfo: 'Asegúrate de que el objeto esté bien iluminado y enfocado',
    capturePhoto: 'Capturar Foto',
    cancel: 'Cancelar',
    
    // Analyze Section
    imageLoaded: 'Imagen cargada. Haz clic en el botón para analizarla.',
    analyzeWaste: 'Analizar Residuo',
    analyzing: 'Analizando imagen... La primera imagen puede tardar hasta 1 minuto.',
    
    // Results
    confidence: 'Confianza',
    recyclable: 'Reciclable',
    notRecyclable: 'No Reciclable',
    materialInfo: 'Información del material',
    recyclingTips: 'Consejos de Reciclaje',
    analyzeAnother: 'Analizar Otro Residuo',
    
    // Material Classes
    cardboard: 'Cartón',
    glass: 'Vidrio',
    metal: 'Metal',
    paper: 'Papel',
    plastic: 'Plástico',
    trash: 'Basura General',
    
    // Material Messages
    cardboardMessage: 'El cartón es reciclable siempre que esté limpio y seco.',
    glassMessage: 'El vidrio es 100% reciclable y puede reciclarse infinitas veces.',
    metalMessage: 'El metal es reciclable y muy valioso para el reciclaje.',
    paperMessage: 'El papel es reciclable siempre que no esté muy sucio.',
    plasticMessage: 'El plástico es reciclable, pero asegúrate de limpiarlo primero.',
    trashMessage: 'Este material no es reciclable y debe desecharse como basura general.',
    
    // Recycling Advice
    cardboardAdvice: 'Aplana las cajas de cartón para ahorrar espacio. Retira cintas adhesivas y grapas. Deposita en el contenedor azul.',
    glassAdvice: 'Enjuaga el vidrio antes de reciclarlo. Retira tapas y corchos. Los espejos y cristales de ventanas NO van en el contenedor de vidrio.',
    metalAdvice: 'Aplasta las latas para reducir volumen. Enjuaga los envases metálicos. Deposita en el contenedor amarillo junto con plásticos.',
    paperAdvice: 'Asegúrate de que el papel esté limpio y seco. El papel sucio o mojado contamina el reciclaje. Deposita en el contenedor azul.',
    plasticAdvice: 'Enjuaga los envases plásticos. Separa las tapas del envase. Reduce el volumen aplastando las botellas. Deposita en el contenedor amarillo.',
    trashAdvice: 'Este material no es reciclable y debe ir al contenedor de basura general. Considera reducir el consumo de materiales no reciclables.',
    notRecyclableAdvice: 'Este material no es reciclable. Deposítalo en el contenedor de basura general. Intenta reducir el uso de productos similares.',
    defaultAdvice: 'Consulta las normas de reciclaje de tu localidad para más información.',
    
    // Errors
    invalidFileFormat: 'Por favor, suelta una imagen válida (JPEG o PNG)',
    formatNotAllowed: 'Formato no permitido. Solo se aceptan archivos JPEG o PNG.',
    fileTooLarge: 'El archivo es demasiado grande. Tamaño máximo:',
    cameraAccessError: 'No se pudo acceder a la cámara. Verifica los permisos.',
    cameraNotReady: 'La cámara aún no está lista. Espera un momento e intenta nuevamente.',
    unknownError: 'Error desconocido',
    
    // Footer
    footerCopyright: 'Todos los derechos reservados.'
  },
  
  en: {
    // Header
    appTitle: 'TrashIA',
    appSubtitle: 'Intelligent Waste Classifier',
    
    // Upload Section
    dragImageHere: 'Drag your image here',
    orClickToSelect: 'or click to select',
    fileRequirements: 'Only JPEG or PNG • Max 5MB',
    selectImage: 'Select Image',
    takePhoto: 'Take Photo',
    
    // Camera Section
    cameraActive: 'Camera Active - Position the object',
    cameraInfo: 'Make sure the object is well-lit and in focus',
    capturePhoto: 'Capture Photo',
    cancel: 'Cancel',
    
    // Analyze Section
    imageLoaded: 'Image loaded. Click the button to analyze it.',
    analyzeWaste: 'Analyze Waste',
    analyzing: 'Analyzing image... The first image may take up to 1 minute.',
    
    // Results
    confidence: 'Confidence',
    recyclable: 'Recyclable',
    notRecyclable: 'Not Recyclable',
    materialInfo: 'Material information',
    recyclingTips: 'Recycling Tips',
    analyzeAnother: 'Analyze Another Waste',
    
    // Material Classes
    cardboard: 'Cardboard',
    glass: 'Glass',
    metal: 'Metal',
    paper: 'Paper',
    plastic: 'Plastic',
    trash: 'General Waste',
    
    // Material Messages
    cardboardMessage: 'Cardboard is recyclable as long as it is clean and dry.',
    glassMessage: 'Glass is 100% recyclable and can be recycled infinitely.',
    metalMessage: 'Metal is recyclable and very valuable for recycling.',
    paperMessage: 'Paper is recyclable as long as it is not too dirty.',
    plasticMessage: 'Plastic is recyclable, but make sure to clean it first.',
    trashMessage: 'This material is not recyclable and should be disposed of as general waste.',
    
    // Recycling Advice
    cardboardAdvice: 'Flatten cardboard boxes to save space. Remove adhesive tapes and staples. Place in the blue recycling bin.',
    glassAdvice: 'Rinse glass before recycling. Remove caps and corks. Mirrors and window glass do NOT go in the glass recycling bin.',
    metalAdvice: 'Crush cans to reduce volume. Rinse metal containers. Place in the yellow bin along with plastics.',
    paperAdvice: 'Make sure the paper is clean and dry. Dirty or wet paper contaminates recycling. Place in the blue bin.',
    plasticAdvice: 'Rinse plastic containers. Separate caps from the container. Reduce volume by crushing bottles. Place in the yellow bin.',
    trashAdvice: 'This material is not recyclable and should go in the general waste bin. Consider reducing consumption of non-recyclable materials.',
    notRecyclableAdvice: 'This material is not recyclable. Place it in the general waste bin. Try to reduce the use of similar products.',
    defaultAdvice: 'Check your local recycling regulations for more information.',
    
    // Errors
    invalidFileFormat: 'Please drop a valid image (JPEG or PNG)',
    formatNotAllowed: 'Format not allowed. Only JPEG or PNG files are accepted.',
    fileTooLarge: 'File is too large. Maximum size:',
    cameraAccessError: 'Could not access camera. Check permissions.',
    cameraNotReady: 'Camera is not ready yet. Wait a moment and try again.',
    unknownError: 'Unknown error',
    
    // Footer
    footerText: 'TrashIA - Helping to classify waste with Artificial Intelligence',
    footerCopyright: 'All rights reserved.'
  }
} as const;

export type Language = 'es' | 'en';
