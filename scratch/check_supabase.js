import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('Checking Supabase connection and data...');
  console.log('URL:', supabaseUrl);

  // 1. Check Profiles
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  if (pError) {
    console.error('Error fetching profiles:', pError.message);
  } else {
    console.log(`\n--- PROFILES (${profiles.length}) ---`);
    profiles.forEach(p => console.log(`- ${p.email} [ID: ${p.id}, Role: ${p.role}]`));
  }

  // 2. Check Accounts
  const { data: accounts, error: aError } = await supabase.from('accounts').select('*, profiles(email)');
  if (aError) {
    console.error('Error fetching accounts:', aError.message);
  } else {
    console.log(`\n--- ACCOUNTS (${accounts.length}) ---`);
    accounts.forEach(a => console.log(`- ${a.account_number} [Balance: ${a.balance}, User: ${a.profiles?.email || 'Unknown'}]`));
  }

  // 3. Check Transactions
  const { data: transactions, error: tError } = await supabase.from('transactions').select('*').limit(5);
  if (tError) {
    console.error('Error fetching transactions:', tError.message);
  } else {
    console.log(`\n--- RECENT TRANSACTIONS (${transactions.length}) ---`);
    transactions.forEach(t => console.log(`- ${t.type}: ${t.amount} [Desc: ${t.description}]`));
  }
}

checkData();
