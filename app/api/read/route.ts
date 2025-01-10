import { google } from 'googleapis';
import { NextResponse } from 'next/server';


async function getSheetData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Product_Database!A2:O',
    });

    const rows = response.data.values || [];
    return rows.map(row => ({
      barcode: row[0],
      category: row[1],
      subCategory: row[2],
      productType: row[3],
      supplierId: row[4],
      name: row[5],
      imageId: row[6],
      size: row[7],
      ctnQty: row[8],
      ctnCost: parseFloat(row[9]) || 0,
      rrp: parseFloat(row[10]) || 0,
      gst: row[11],
      gstRate: row[12],
      discountRate: row[13],
      status: row[14],
    }));
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error && 
        typeof error.message === 'string' && error.message.includes('Quota exceeded')) {
      return getSheetData(); // Retry the request
    }
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

export async function GET() {
  const data = await getSheetData();
  return NextResponse.json(data);
}  
