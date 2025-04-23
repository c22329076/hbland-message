'use client';

import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import '../styles/barcode.css';

export default function BarcodeApp() {
    const [number, setNumber] = useState('');
    const [sqlQuery, setSqlQuery] = useState('');
    const [logEntries, setLogEntries] = useState([]);
    const [statusMessage, setStatusMessage] = useState([]);
    const barcodeRef = useRef(null);
    const scanBuffer = useRef('');
    let isGenerate = false;

    useEffect(() => {
        if (sqlQuery && barcodeRef.current) {
            JsBarcode(barcodeRef.current, sqlQuery, { format: 'CODE128', displayValue: true });
        }
    }, [sqlQuery]);

    useEffect(() => {
        let isShiftPressed = false;
        let clearTimer;
        const handleScanInput = (event) => {
            if (document.activeElement.tagName === 'INPUT') return; // 避免影響手動輸入

            clearTimeout(clearTimer); // 清除上次的 timeout
            if(event.key === "Shift"){
                isShiftPressed = true;
                return;
            }
            
            if (scanBuffer.current.length > 11) {
                scanBuffer.current += event.key;
                const scannedBarcode = scanBuffer.current;
                console.log("條碼資料", scannedBarcode);
                if(scanBuffer.current[0] !== "1"){
                    console.log("幹你亂打啦");
                    setLogEntries(prev => [...prev, {
                        result: `${scannedBarcode.slice(0, 3)}年${scannedBarcode.slice(3, 7)} ${scannedBarcode.slice(7, 13)}案件傳送失敗😥`
                    }]); 
                }
                else{
                    sendScannedData(scannedBarcode);
                }
                scanBuffer.current = ''; // 清空暫存
            } else {
                if(event.key.length === 1){
                    let char = event.key;
                    //判斷有沒有按shift
                    if(isShiftPressed){
                        char = char.toUpperCase();
                        isShiftPressed = false;
                    }
                scanBuffer.current += char;
                }
            }

            // 設定 100ms 後自動清除 避免誤觸
            clearTimer = setTimeout(() => {
                scanBuffer.current = '';
                isShiftPressed = false;
            }, 100);
        };

        window.addEventListener('keydown', handleScanInput);
        return () => {
            window.removeEventListener('keydown', handleScanInput);
        };
    }, []);

    const generateBarcode = () => {
        if (!number) return;
        const query = `SELECT * FROM CRSMS WHERE barcode = '${number}';`;
        scanBuffer.current = ''; // 在輸入件號時不放入buffer
        isGenerate = true;
        setSqlQuery(number);
    };

    const sendScannedData = async (scannedData) => {
        const timestemp = new Date().toLocaleString('zh-TW', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).replace(/\//g, '-');
    
        const s_SbSX731 = scannedData.slice(0, 3);
        const s_VbJ7gs3 = scannedData.slice(3, 7);
        const s_Nuu3763 = scannedData.slice(7, 13);
    
        setLogEntries(prev => [...prev, {
            message: `${timestemp} ${s_SbSX731}年${s_VbJ7gs3} ${s_Nuu3763}案件傳送中，請稍後😎`
        }]);
    
        try {
            const response = await fetch("/api/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ s_SbSX731, s_VbJ7gs3, s_Nuu3763 })
            });
    
            const result = await response.json();
    
            const lastUpdate = (text) => {
                setLogEntries(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        result: text
                    };
                    return updated;
                });
            };
    
            switch(result.status_code){
                case "11":
                    lastUpdate(` ${s_SbSX731}年${s_VbJ7gs3} ${s_Nuu3763}案件${result.status_defn}簡訊😄`);
                    break;
                case "12":
                    lastUpdate(` ${s_SbSX731}年${s_VbJ7gs3} ${s_Nuu3763}案件的手機號碼格式不合，無法傳送😭`);
                    break;
                case "13":
                    lastUpdate(` ${s_SbSX731}年${s_VbJ7gs3} ${s_Nuu3763}案件沒有提供手機號碼，無法傳送😭`);
                    break;
                case "21":
                    lastUpdate(` ${s_SbSX731}年${s_VbJ7gs3} ${s_Nuu3763}案件的年字號不完整，無法傳送😭`);
                    break;
                case "22":
                    lastUpdate(` ${s_SbSX731}年${s_VbJ7gs3} ${s_Nuu3763}案件的年字號不存在，無法傳送😭`);
                    break;
                case "23":
                    lastUpdate(` 非法闖入偵測🚨`);
                    break;
                case "29":
                    lastUpdate(` 發生未知錯誤😭`);
                    break;
                default:
                    lastUpdate(` 無法解析後端回應😓`);
                    break;
            }
    
        } catch (error) {
            console.error("連線錯誤：", error);
        }
    };    

    return (
        <div className="container">
            
            <div className="section-left">
                <h2 className="title">輸入數字產生條碼</h2>
                <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="請輸入數字"
                    className="input-box"
                />
                <button
                    onClick={generateBarcode}
                    className="button"
                >
                    確認
                </button>
                <p className="gray-text">{sqlQuery}</p>
            </div>
            
            <div className="section-right">
            <h2 className="title">請掃描條碼</h2>
            <p className="gray-text">請直接使用掃碼器輸入條碼，系統將自動處理</p>

            <ol className='status-message-list'>
                {logEntries.map((entry, index) => (
                    <li key={index}>
                        {entry.message}
                        {entry.result && (
                        <ul>
                            <li>{entry.result}</li>
                        </ul>
                        )}
                    </li>
                ))}
            </ol>
            </div>
            
            <div className="section-center">
                <svg ref={barcodeRef}></svg>
            </div>
        </div>
    );
}
