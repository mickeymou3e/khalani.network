pairs = { "CKB-USDC" "CKB-USDT" "CKB-ETH" "CKB-WBTC|eth" "USDC-CKB" "USDC-ETH" "USDC-WBTC|eth" "WBTC|eth-CKB" "WBTC|eth-USDC" "ETH-USDC" "ETH-CKB" "USDT-CKB" }
inputDecimals = [ 18 18 18 18 6 6 6 8 8 18 18 6 ]

outputDecimals = [ 6 6 18 8 18 18 8 18 6 6 18 18 ]

for i=1:length(pairs)
    name=pairs{i}
    inputDecimal=inputDecimals(i)
    outputDecimal=outputDecimals(i)
    input = load(strcat(name,".txt"))

    x = input(:,1)
    sor_y = input(:,2)
    qbs_y = input(:,3)

    x_norm = x ./ power(10, inputDecimal)
    diff = (sor_y .- qbs_y) ./ power(10, outputDecimal)

    hf = figure();
    tokens=strsplit(name, "-")
    inputToken=tokens{1}
    outputToken=tokens{2}
    plot(x_norm, diff, 'o','LineWidth', 2)
    legend("sor-qbs")
    xlabel(inputToken)
    ylabel(outputToken)
    set (hf, "visible", "off");
    print (hf, strcat(name,".png"), "-dpng");
end
