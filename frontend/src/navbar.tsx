import { FC, useEffect, useState } from 'react';
import {
    Navbar as NextNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    User,
} from '@nextui-org/react';
import { useAccount, useBalance, useConnect, getRecords } from '@puzzlehq/sdk';

export const Navbar: FC = () => {
    const {account} = useAccount()
    const {connect} = useConnect()
    const [records, setRecords] = useState<any>(null)

    useEffect(() => {
        if (account) {
            getRecords({ address: account.address, filter: { programId: "aleo_casino_v001.aleo", type: "unspent" } }).then((records) => {
                setRecords(records.records?.reduce((acc, rec) => {
                    const amount = Number(rec.data.amount.replace("u128.private", ""))
                    return acc + amount / 10 ** 6
                }, 0))
            })
        }
    }, [account])

    return (
        <NextNavbar>
            <NavbarContent className="sm:hidden pr-3" justify="start">
                {/* <RouterLink to="/"> */}
                    <NavbarBrand>
                        {/* <img src="/logo.jpg" alt="logo" style={{ width: 50, height: 50, marginRight: 30 }}/> */}
                        <p className="font-bold text-inherit">BetAleo</p>
                    </NavbarBrand>
                {/* </RouterLink> */}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    {account && account.address ? (
                        <User
                            name={`${account.address.slice(
                                    0,
                                    5,
                                )}...${account.address.slice(
                                    account.address.length - 6,
                                )}`}
                            description={records}
                            
                            avatarProps={{
                                src: "",
                            }}
                        />
                    ) : (
                        <Button
                            onPress={connect}
                            as={Link}
                            color="warning"
                            href="#"
                            variant="flat"
                        >
                            Sign in
                        </Button>
                    )}
                </NavbarItem>
            </NavbarContent>
        </NextNavbar>
    );
};
