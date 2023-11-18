// The 'aleo_casino' program.
program aleo_casino_v001.aleo {
    mapping account: address => u128;

    struct MintSecret {
        amount: u128,
        nonce: u128,
    }

    record Token {
        owner: address,        
        amount: u128
    }

    mapping already_minted: field => bool;

    transition mint(amount: u128, nonce: u128, s: signature, recipient: address) -> Token {
        let addr: address  = aleo10eq9ur0r30884paxqmm85gy0e97ay264skpaqsnm0ye2glp5yvgswmrlqv;
        let ms: MintSecret = MintSecret {
            amount,
            nonce
        };
        assert(signature::verify(s, addr, ms));
        return Token {
            owner: recipient,        
            amount
        } then finalize(BHP256::hash_to_field(ms));
    }

    finalize mint(mint_hash: field) {
        assert(Mapping::contains(already_minted, mint_hash) == false);
        Mapping::set(already_minted, mint_hash, true);
    }

        /* Transfer */
    transition transfer_public(public receiver: address, public amount: u128) {
        // Transfer the tokens publicly, by invoking the computation on-chain.
        return then finalize(self.caller, receiver, amount);
    }

    finalize transfer_public(public sender: address, public receiver: address, public amount: u128) {
        // Decrements `account[sender]` by `amount`.
        // If `account[sender]` does not exist, it will be created.
        // If `account[sender] - amount` underflows, `transfer_public` is reverted.
        let sender_amount: u128 = Mapping::get_or_use(account, sender, 0u128);
        Mapping::set(account, sender, sender_amount - amount);
        // Increments `account[receiver]` by `amount`.
        // If `account[receiver]` does not exist, it will be created.
        // If `account[receiver] + amount` overflows, `transfer_public` is reverted.
        let receiver_amount: u128 = Mapping::get_or_use(account, receiver, 0u128);
        Mapping::set(account, receiver, receiver_amount + amount);
    }

    // The function `transfer_private` sends the specified token amount to the token receiver from the specified token record.
    transition transfer_private(sender: Token, receiver: address, amount: u128) -> (Token, Token) {
        // Checks the given token record has sufficient balance.
        // This `sub` operation is safe, and the proof will fail if an overflow occurs.
        // `difference` holds the change amount to be returned to sender.
        let difference: u128 = sender.amount - amount;

        // Produce a token record with the change amount for the sender.
        let remaining: Token = Token {
            owner: sender.owner,
            amount: difference,
        };

        // Produce a token record for the specified receiver.
        let transferred: Token = Token {
            owner: receiver,
            amount: amount,
        };

        // Output the sender's change record and the receiver's record.
        return (remaining, transferred);
    }

    // The function `transfer_private_to_public` turns a specified token amount from a token record into public tokens for the specified receiver.
    // This function preserves privacy for the sender's record, however it publicly reveals the token receiver and the token amount.
    transition transfer_private_to_public(sender: Token, public receiver: address, public amount: u128) -> Token {
        // Checks the given token record has a sufficient token amount.
        // This `sub` operation is safe, and the proof will fail if an underflow occurs.
        // `difference` holds the change amount for the caller.
        let difference: u128 = sender.amount - amount;

        // Produces a token record with the change amount for the caller.
        let remaining: Token = Token {
            owner: sender.owner,
            amount: difference,
        };

        // Output the sender's change record.
        // Increment the token amount publicly for the token receiver.
        return remaining then finalize(receiver, amount);
    }

    finalize transfer_private_to_public(public receiver: address, public amount: u128) {
        // Increments `account[receiver]` by `amount`.
        // If `account[receiver]` does not exist, it will be created.
        // If `account[receiver] + amount` overflows, `transfer_private_to_public` is reverted.
        let current_amount: u128 = Mapping::get_or_use(account, receiver, 0u128);
        Mapping::set(account, receiver, current_amount + amount);
    }

    // The function `transfer_public_to_private` turns a specified token amount from `account` into a token record for the specified receiver.
    // This function preserves privacy for the receiver's record, however it publicly reveals the caller and the specified token amount.
    transition transfer_public_to_private(public receiver: address, public amount: u128) -> Token {
        // Produces a token record for the token receiver.
        let transferred: Token = Token {
            owner: receiver,
            amount: amount,
        };

        // Output the receiver's record.
        // Decrement the token amount of the caller publicly.
        return transferred then finalize(self.caller, amount);
    }

    finalize transfer_public_to_private(public sender: address, public amount: u128) {
        // Decrements `account[sender]` by `amount`.
        // If `account[sender]` does not exist, it will be created.
        // If `account[sender] - amount` underflows, `transfer_public_to_private` is reverted.
        let current_amount: u128 = Mapping::get_or_use(account, sender, 0u128);
        Mapping::set(account, sender, current_amount - amount);
    }

}
