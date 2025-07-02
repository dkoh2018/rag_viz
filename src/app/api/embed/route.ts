import { NextRequest, NextResponse } from 'next/server';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { traceable } from 'langsmith/traceable';
import * as fs from 'fs';
import * as path from 'path';

// Ensure vectorstore directory exists
const ensureVectorStoreDir = () => {
  const vectorStoreDir = path.join(process.cwd(), 'vectorstore');
  if (!fs.existsSync(vectorStoreDir)) {
    fs.mkdirSync(vectorStoreDir, { recursive: true });
  }
  return vectorStoreDir;
};

// Document embedding with LangSmith tracing
const embedDocuments = traceable(
  async (fileContent: string, fileName: string) => {
    console.log(`📄 [EMBED] Processing file: ${fileName}`);
    
    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await textSplitter.createDocuments([fileContent]);
    console.log(`📑 [EMBED] Created ${splitDocs.length} document chunks`);
    
    // Initialize embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    
    // Create vector store
    const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);
    
    // Save to disk
    const vectorStoreDir = ensureVectorStoreDir();
    const storePath = path.join(vectorStoreDir, 'rag-store.index');
    await vectorStore.save(storePath);
    
    console.log(`💾 [EMBED] Vector store saved to: ${storePath}`);
    
    return {
      chunksCreated: splitDocs.length,
      storePath: storePath
    };
  },
  {
    name: 'embedDocuments',
    tags: ['embedding', 'vectorstore', 'langchain'],
  }
);

export async function POST(request: NextRequest) {
  console.log('🌐 [EMBED] Document embedding API endpoint called');
  
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      console.error('❌ [EMBED] Missing file input');
      return NextResponse.json({
        message: 'Missing file input',
        success: false
      }, { status: 400 });
    }

    console.log(`📁 [EMBED] Processing file: ${file.name} (${file.size} bytes)`);
    
    const fileContent = await file.text();
    console.log(`📝 [EMBED] File content length: ${fileContent.length} characters`);
    
    // Process file with LangSmith tracing
    const result = await embedDocuments(fileContent, file.name);
    
    const response = {
      success: true,
      message: 'Document successfully embedded',
      fileName: file.name,
      chunksCreated: result.chunksCreated,
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 [EMBED] Sending response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('💥 [EMBED] Embedding API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process document',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}