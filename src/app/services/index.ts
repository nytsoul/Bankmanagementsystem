import supabase from './supabaseClient';

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Fetch profile for the role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'customer'
      },
      session: data.session
    };
  },

  async register(userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || 'customer'
        }
      }
    });
    if (error) throw error;
    return data.user;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
};

export const accountService = {
  async createAccount(userId: string, accountData: any) {
    // Generate a simple account number if not provided
    const accountNumber = accountData.accountNumber || `ACC-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    const { data, error } = await supabase
      .from('accounts')
      .insert([{
        user_id: userId,
        account_number: accountNumber,
        account_type: accountData.accountType.toLowerCase(),
        balance: accountData.balance || 0,
        interest_rate: accountData.interestRate || 0,
        is_active: accountData.isActive !== false
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAccounts() {
    const { data, error } = await supabase
      .from('accounts')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getAccountsByUser(userId: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async updateAccount(id: string, data: any) {
    const { data: updated, error } = await supabase
      .from('accounts')
      .update({
        account_type: data.accountType?.toLowerCase(),
        balance: data.balance,
        interest_rate: data.interestRate,
        is_active: data.isActive
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  },

  async deleteAccount(id: string) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

export const transactionService = {
  async createTransaction(data: any) {
    // Check if it's a transfer
    if (data.transactionType === 'TRANSFER' && data.recipientAccount) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('perform_transfer', {
        sender_account_id: data.accountId,
        receiver_account_number: data.recipientAccount,
        transfer_amount: data.amount,
        transfer_description: data.description
      });
      if (rpcError) throw rpcError;
      if (!rpcData.success) throw new Error(rpcData.message);
      return rpcData;
    }

    // Otherwise, it's a deposit or withdrawal
    const multiplier = data.transactionType === 'WITHDRAWAL' ? -1 : 1;
    const amount = data.amount * multiplier;

    // Use a transaction-like approach (though Supabase REST doesn't support multi-table transactions easily without RPC)
    // For simplicity, we update balance and create transaction record.
    // Ideally, this should also be an RPC for safety.
    
    const { error: updateError } = await supabase.rpc('increment_balance', {
      row_id: data.accountId,
      amount: amount
    }).catch(async () => {
        // Fallback if rpc not defined yet, but we should define it in our SQL
        const { data: acc } = await supabase.from('accounts').select('balance').eq('id', data.accountId).single();
        return supabase.from('accounts').update({ balance: (acc?.balance || 0) + amount }).eq('id', data.accountId);
    });

    const { data: tx, error } = await supabase
      .from('transactions')
      .insert([{
        account_id: data.accountId,
        type: data.transactionType.toLowerCase(),
        amount: amount,
        description: data.description,
        status: 'completed'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return tx;
  },

  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getAccountTransactions(accountId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('transaction_date', { ascending: false });
    if (error) throw error;
    return data;
  }
};

export const userService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data.map((p: any) => ({
      ...p,
      firstName: p.first_name,
      lastName: p.last_name,
      phoneNumber: p.phone_number,
      zipCode: p.zip_code,
      isActive: p.is_active,
      createdAt: p.created_at
    }));
  },

  async getUser(id: string) {
    const { data: p, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return {
      ...p,
      firstName: p.first_name,
      lastName: p.last_name,
      phoneNumber: p.phone_number,
      zipCode: p.zip_code,
      isActive: p.is_active,
      createdAt: p.created_at
    };
  },

  async updateUser(id: string, data: any) {
    const { data: updated, error } = await supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        address: data.address,
        role: data.role?.toLowerCase(),
        is_active: data.isActive
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  },

  async deleteUser(id: string) {
    // In Supabase, deleting from profiles will work, 
    // but auth user needs to be deleted via admin API which is restricted.
    // We'll just deactivate them for now.
    return this.updateUser(id, { isActive: false });
  }
};

export const scheduledTransactionService = {
  async createScheduledTransaction(data: any) {
    const { data: tx, error } = await supabase
      .from('scheduled_transactions')
      .insert([{
        account_id: data.accountId,
        amount: data.amount,
        description: data.description,
        scheduled_date: data.scheduledDate,
        recurrence_type: data.recurrenceType.toLowerCase(),
        recipient_account: data.recipientAccount,
        status: 'active'
      }])
      .select()
      .single();
    if (error) throw error;
    return tx;
  },

  async getAllScheduledTransactions() {
    const { data, error } = await supabase
      .from('scheduled_transactions')
      .select('*');
    if (error) throw error;
    return data;
  }
};
