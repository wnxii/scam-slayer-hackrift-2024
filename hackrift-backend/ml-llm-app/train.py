from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, DataCollatorWithPadding, TrainingArguments, Trainer

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

scam_labels = [
    'scam', 'suspicious', 'highly_suspicious', 'slightly_suspicious', 'potential_scam',
    'scam_response', 'citing urgency', 'suggesting a dangerous situation', 'dismissive official protocols', 'dismissive official protocols"'
]

non_scam_labels = [
    'neutral', 'legitimate', 'standard_opening, identification_request', 'polite_ending',
    'adhering to protocols', 'emphasizing security and compliance', 'ready for further engagement'
]

# declare labels
scam_label_id = {
    "not_scam": 0,
    "scam": 1
}

# map textual labels to integers
def encode_scam_label(example):
    clean_label = example["LABEL"].lower().strip().strip('"')
    
    if clean_label in scam_labels:
        mapped_label = "scam"
    elif clean_label in non_scam_labels:
        mapped_label = "not_scam"
    else:
        print(f"Unknown label: {clean_label}")
        mapped_label = "not_scam"

    example["labels"] = scam_label_id[mapped_label]
    return example

# tokenize dataset
def preprocess_function(examples):
    return tokenizer(examples["TEXT"], truncation=True, padding="max_length", max_length=128)

# load dataset and remove conversation id
dataset = load_dataset('csv', data_files='call_scam_transcripts.csv',
                       delimiter=",",
                       quotechar='"')
dataset = dataset['train']
dataset = dataset.remove_columns('CONVERSATION_ID')

# split dataset for testing
dataset = dataset.train_test_split(test_size=0.1)
train_dataset = dataset['train']
eval_dataset = dataset['test']

# map text
train_dataset = train_dataset.map(encode_scam_label)
eval_dataset = eval_dataset.map(encode_scam_label)

# load tokenizer and tokenize dataset
tokenized_train = train_dataset.map(preprocess_function, batched=True)
tokenized_eval = eval_dataset.map(preprocess_function, batched=True)

print(tokenized_train.column_names)

# set format for pytorch
tokenized_train.set_format("torch", columns=["input_ids", "attention_mask", "labels"])
tokenized_eval.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

# data collator
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# load model with 4 labels
model = AutoModelForSequenceClassification.from_pretrained(
    "huawei-noah/TinyBERT_General_4L_312D",
    num_labels = 2
)

training_args = TrainingArguments(
    output_dir = "./results",
    eval_strategy = "epoch",
    per_device_train_batch_size = 8,
    per_device_eval_batch_size = 8,
    num_train_epochs = 3,
    weight_decay = 0.01,
)

trainer = Trainer(
    model = model,
    args = training_args,
    train_dataset = tokenized_train,
    eval_dataset = tokenized_eval,
    data_collator = data_collator,
    tokenizer = tokenizer,
)

trainer.train()