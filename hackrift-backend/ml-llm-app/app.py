from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from memory_profiler import profile

tokenizer = AutoTokenizer.from_pretrained("./results/tinybert")
model = AutoModelForSequenceClassification.from_pretrained("./results/tinybert")
tokenizer = AutoTokenizer.from_pretrained("./results/distilbert")
model = AutoModelForSequenceClassification.from_pretrained("./results/distilbert")

model.eval()

@profile
def predict_text(text):
    # Tokenize new input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=128)
    
    # Get model prediction
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
    # Get prediction class
    predicted_class = torch.argmax(predictions).item()
    confidence = predictions[0][predicted_class].item()
    
    return predicted_class, confidence

if __name__ == "__main__":
    new_text = "We have "
    
    print("Starting prediction...")
    predicted_class, confidence = predict_text(new_text)
    
    # Print results
    label_map = {0: "not_scam", 1: "scam"}
    print(f"Text: {new_text}")
    print(f"Predicted class: {label_map[predicted_class]}")
    print(f"Confidence: {confidence:.2%}")