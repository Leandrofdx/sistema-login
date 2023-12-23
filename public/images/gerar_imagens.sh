#!/bin/bash
for i in {1..500}
do
  cp imagem1.jpeg "imagem${i}.jpeg"
done

echo "Operação concluída"