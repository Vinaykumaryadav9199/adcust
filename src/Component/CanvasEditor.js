class CanvasEditor {
    constructor(canvasRef, templateData, captionInputRef) {
        this.canvasRef = canvasRef;
        this.templateData = templateData;
        this.bgColor = templateData.urls.background_color || '#0369A1';
        this.captionText = templateData.caption.text;
        this.ctaText = templateData.cta.text;
        this.selectedImage = null;
        this.imageMask = new Image();
        this.maskStroke = new Image();
        this.designPattern = new Image();
        this.captionInputRef = captionInputRef; // Reference to the input field for caption

        // Set up onload handlers for images
        this.imageMask.onload = this.initializeCanvas.bind(this);
        this.maskStroke.onload = this.initializeCanvas.bind(this);
        this.designPattern.onload = this.initializeCanvas.bind(this);

        // Load images
        this.imageMask.src = "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png";
        this.maskStroke.src = "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png";
        this.designPattern.src = "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png";

        // Add event listener to input field for caption
        this.captionInputRef.addEventListener('input', this.handleCaptionInputChange.bind(this));
    }

    handleCaptionInputChange(event) {
        this.captionText = event.target.value;
        this.initializeCanvas();
    }

    initializeCanvas() {
        const canvas = this.canvasRef.current;
        if (!canvas) {
            console.error('Canvas element not found.');
            return;
        }
    
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('2D context not supported.');
            return;
        }
    
        // Draw background color
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(this.templateData.image_mask.x, this.templateData.image_mask.y, this.templateData.image_mask.width, this.templateData.image_mask.height);
    
        // Draw mask stroke and design pattern
      
        ctx.drawImage(this.maskStroke, this.templateData.image_mask.x, this.templateData.image_mask.y, this.templateData.image_mask.width, this.templateData.image_mask.height);
        ctx.drawImage(this.designPattern, this.templateData.image_mask.x, this.templateData.image_mask.y, this.templateData.image_mask.width, this.templateData.image_mask.height);
        ctx.drawImage(this.imageMask, this.templateData.image_mask.x, this.templateData.image_mask.y, this.templateData.image_mask.width, this.templateData.image_mask.height);
        // Draw image if available
        if (this.selectedImage) {
            this.drawImageInMask(ctx);
        }
    
        this.drawTexts(ctx); // Draw texts on top
    }

    drawImageInMask(ctx) {
        const image = new Image();
        image.src = this.selectedImage;
        image.onload = () => {
            ctx.drawImage(image, this.templateData.image_mask.x + 50, this.templateData.image_mask.y + this.templateData.image_mask.height / 2 - 50,
                this.templateData.image_mask.width - 100, this.templateData.image_mask.height / 2 + 25);
        };
    }

    drawTexts(ctx) {
        // Draw caption
        ctx.fillStyle = this.templateData.caption.text_color;
        ctx.font = `${this.templateData.caption.font_size}px Arial`;

        const lines = this.wrapText(this.captionText, 31); // Wrap text with a maximum of 31 characters per line

        lines.forEach((line, index) => {
            ctx.textAlign = this.templateData.caption.alignment;
            ctx.fillText(line, this.templateData.image_mask.x + this.templateData.caption.position.x, this.templateData.image_mask.y + this.templateData.caption.position.y + (index * this.templateData.caption.font_size));
        });

        // Draw CTA
        ctx.fillStyle = this.templateData.cta.background_color;
        const ctaWidth = ctx.measureText(this.ctaText).width + 30;
        const ctaHeight = 60;
        const ctaX = this.templateData.cta.position.x;
        const ctaY = this.templateData.image_mask.y + this.templateData.caption.position.y + lines.length * this.templateData.caption.font_size + 5; // Adjust 10 for spacing

        // Draw rounded rectangle background for CTA
        const cornerRadius = 10; // Adjust the corner radius as needed
        ctx.beginPath();
        ctx.moveTo(ctaX + cornerRadius, ctaY);
        ctx.lineTo(ctaX + ctaWidth - cornerRadius, ctaY);
        ctx.arcTo(ctaX + ctaWidth, ctaY, ctaX + ctaWidth, ctaY + cornerRadius, cornerRadius);
        ctx.lineTo(ctaX + ctaWidth, ctaY + ctaHeight - cornerRadius);
        ctx.arcTo(ctaX + ctaWidth, ctaY + ctaHeight, ctaX + ctaWidth - cornerRadius, ctaY + ctaHeight, cornerRadius);
        ctx.lineTo(ctaX + cornerRadius, ctaY + ctaHeight);
        ctx.arcTo(ctaX, ctaY + ctaHeight, ctaX, ctaY + ctaHeight - cornerRadius, cornerRadius);
        ctx.lineTo(ctaX, ctaY + cornerRadius);
        ctx.arcTo(ctaX, ctaY, ctaX + cornerRadius, ctaY, cornerRadius);
        ctx.closePath();
        ctx.fill();

        // Draw CTA text
        ctx.fillStyle = this.templateData.cta.text_color;
        ctx.font = `${this.templateData.cta.font_size || 30}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.ctaText, ctaX + ctaWidth / 2, ctaY + ctaHeight / 2);
    }

    wrapText(text, maxCharactersPerLine) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
      
        words.forEach(word => {
            const width = this.canvasRef.current.getContext('2d').measureText(currentLine + ' ' + word).width;
            if ((currentLine + ' ' + word).length <= maxCharactersPerLine) {
                currentLine += (currentLine === '' ? '' : ' ') + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });
    
        lines.push(currentLine);
        return lines;
    }
    

    setImage(imageData) {
        this.selectedImage = imageData;
        this.initializeCanvas();
    }

    setBgColor(color) {
        this.bgColor = color;
        this.initializeCanvas();
    }

    setCaptionText(text) {
        this.captionText = text;
        this.initializeCanvas();
    }

    setCtaText(text) {
        this.ctaText = text;
        this.initializeCanvas();
    }
}

export default CanvasEditor;
