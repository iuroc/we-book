import { NetworkInterfaceInfo, networkInterfaces } from 'os'

export const getIPs = () => {
    const infos = Object.values(networkInterfaces()).flat().filter(
        item => item && item.family === 'IPv4'
    ) as NetworkInterfaceInfo[]
    return infos.map(item => item.address)
}